"""Service layer for firewall-style IP blocks and their expiry lifecycle."""
import asyncio
from datetime import datetime, timezone

import structlog
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import AsyncSessionLocal
from backend.models.blocked_ip import BlockedIP

log = structlog.get_logger(__name__)


class BlockedIPService:
    async def deactivate_expired(self, session: AsyncSession) -> int:
        """Mark every active block whose ``expires_at`` is in the past inactive.

        Blocks with a NULL ``expires_at`` are permanent and never touched.
        Returns the number of rows deactivated.
        """
        now = datetime.now(timezone.utc)
        result = await session.execute(
            update(BlockedIP)
            .where(
                BlockedIP.is_active.is_(True),
                BlockedIP.expires_at.is_not(None),
                BlockedIP.expires_at <= now,
            )
            .values(is_active=False)
        )
        await session.commit()
        return result.rowcount or 0

    async def list_active(self, session: AsyncSession) -> list[BlockedIP]:
        result = await session.execute(
            select(BlockedIP).where(BlockedIP.is_active.is_(True))
        )
        return list(result.scalars().all())

    async def run_cleanup_loop(self, *, interval_seconds: int = 300) -> None:
        """Expire stale IP blocks every ``interval_seconds`` until cancelled.

        Each tick uses its own session so a transient DB error never poisons
        the long-lived loop.
        """
        log.info("ip_block_cleanup_started", interval_seconds=interval_seconds)
        try:
            while True:
                await asyncio.sleep(interval_seconds)
                try:
                    async with AsyncSessionLocal() as session:
                        removed = await self.deactivate_expired(session)
                    if removed:
                        log.info("ip_block_cleanup_expired", count=removed)
                except asyncio.CancelledError:
                    raise
                except Exception:  # noqa: BLE001 — never let one tick kill the loop
                    log.exception("ip_block_cleanup_tick_failed")
        except asyncio.CancelledError:
            log.info("ip_block_cleanup_stopped")
            raise


blocked_ip_service = BlockedIPService()
