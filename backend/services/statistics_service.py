"""Service layer for traffic/alert statistics and dashboard aggregation."""
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Optional

import structlog
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import AsyncSessionLocal
from backend.models.alert import Alert
from backend.models.rule import DetectionRule
from backend.models.statistics import TrafficStatistics
from backend.repositories import statistics_repo

log = structlog.get_logger(__name__)


class StatisticsService:
    async def get_current_stats(self, session: AsyncSession) -> Optional[TrafficStatistics]:
        return await statistics_repo.get_latest(session)

    async def aggregate_once(self, session: AsyncSession, *, window_seconds: int = 60) -> Optional[TrafficStatistics]:
        """Compute and persist a single traffic-statistics snapshot.

        Counts alerts observed in the trailing ``window_seconds`` and carries
        forward packet/byte counters from the previous snapshot (there is no
        packet-capture source wired in, so these remain flat until one exists).
        Returns the persisted row, or ``None`` if a snapshot for this timestamp
        already exists (the timestamp column is unique).
        """
        now = datetime.now(timezone.utc)
        window_start = now - timedelta(seconds=window_seconds)

        severity_rows = await session.execute(
            select(Alert.severity, func.count())
            .where(Alert.timestamp >= window_start)
            .group_by(Alert.severity)
        )
        counts = {sev: count for sev, count in severity_rows.all()}
        alerts_total = sum(counts.values())

        previous = await statistics_repo.get_latest(session)
        snapshot = TrafficStatistics(
            timestamp=now.replace(microsecond=0),
            alerts_total=alerts_total,
            alerts_critical=counts.get("CRITICAL", 0),
            alerts_high=counts.get("HIGH", 0),
            bytes_in=previous.bytes_in if previous else 0,
            bytes_out=previous.bytes_out if previous else 0,
            packets_in=previous.packets_in if previous else 0,
            packets_out=previous.packets_out if previous else 0,
        )
        session.add(snapshot)
        try:
            await session.commit()
        except IntegrityError:
            # A snapshot already exists for this second — skip this tick.
            await session.rollback()
            return None
        await session.refresh(snapshot)
        return snapshot

    async def run_aggregator_loop(self, *, interval_seconds: int = 60) -> None:
        """Persist a traffic-statistics snapshot every ``interval_seconds``.

        Runs until cancelled. Each tick uses its own session so a transient DB
        error never poisons the long-lived loop.
        """
        log.info("stats_aggregator_started", interval_seconds=interval_seconds)
        try:
            while True:
                await asyncio.sleep(interval_seconds)
                try:
                    async with AsyncSessionLocal() as session:
                        await self.aggregate_once(session, window_seconds=interval_seconds)
                except asyncio.CancelledError:
                    raise
                except Exception:  # noqa: BLE001 — never let one tick kill the loop
                    log.exception("stats_aggregator_tick_failed")
        except asyncio.CancelledError:
            log.info("stats_aggregator_stopped")
            raise

    async def get_dashboard_stats(self, session: AsyncSession) -> dict:
        """Aggregate the KPIs, severity breakdown, 24h trend and top talkers.

        Shape matches the frontend DashboardStats interface in
        frontend/app/(dashboard)/dashboard/page.tsx.
        """
        now = datetime.now(timezone.utc)
        day_ago = now - timedelta(hours=24)

        total_today = await session.scalar(
            select(func.count()).select_from(Alert).where(Alert.timestamp >= day_ago)
        ) or 0

        critical_high_today = await session.scalar(
            select(func.count())
            .select_from(Alert)
            .where(Alert.timestamp >= day_ago, Alert.severity.in_(("CRITICAL", "HIGH")))
        ) or 0

        active_rules = await session.scalar(
            select(func.count()).select_from(DetectionRule).where(DetectionRule.is_active.is_(True))
        ) or 0

        latest_stats = await statistics_repo.get_latest(session)
        packets_analyzed = 0
        if latest_stats:
            packets_analyzed = (latest_stats.packets_in or 0) + (latest_stats.packets_out or 0)

        # Severity breakdown across the last 24h.
        severity_rows = await session.execute(
            select(Alert.severity, func.count())
            .where(Alert.timestamp >= day_ago)
            .group_by(Alert.severity)
        )
        alerts_by_severity = {sev: count for sev, count in severity_rows.all()}
        for level in ("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"):
            alerts_by_severity.setdefault(level, 0)

        # Hourly trend for the last 24h, zero-filled so the chart is continuous.
        trend_rows = await session.execute(
            select(Alert.timestamp, Alert.id).where(Alert.timestamp >= day_ago)
        )
        buckets = {i: 0 for i in range(24)}
        for ts, _ in trend_rows.all():
            if ts.tzinfo is None:
                ts = ts.replace(tzinfo=timezone.utc)
            hours_ago = int((now - ts).total_seconds() // 3600)
            if 0 <= hours_ago < 24:
                buckets[23 - hours_ago] += 1
        alerts_trend_24h = [
            {
                "hour": (now - timedelta(hours=23 - i)).strftime("%H:00"),
                "count": buckets[i],
            }
            for i in range(24)
        ]

        # Top source IPs by alert volume in the last 24h.
        top_rows = await session.execute(
            select(Alert.src_ip, Alert.geo_country, func.count().label("cnt"))
            .where(Alert.timestamp >= day_ago)
            .group_by(Alert.src_ip, Alert.geo_country)
            .order_by(func.count().desc())
            .limit(5)
        )
        top_src_ips = [
            {"ip": ip, "country": country, "count": cnt}
            for ip, country, cnt in top_rows.all()
        ]

        return {
            "total_alerts_today": total_today,
            "critical_alerts_today": critical_high_today,
            "active_rules_count": active_rules,
            "packets_analyzed": packets_analyzed,
            "alerts_by_severity": alerts_by_severity,
            "alerts_trend_24h": alerts_trend_24h,
            "top_src_ips": top_src_ips,
        }


statistics_service = StatisticsService()
