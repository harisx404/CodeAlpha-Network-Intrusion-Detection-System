"""Service layer for alert retrieval and lifecycle management."""
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.exceptions import NotFoundError
from backend.models.alert import Alert
from backend.repositories import alert_repo
from backend.schemas.alert import AlertFilter, AlertUpdate


class AlertService:
    async def get_alerts(
        self,
        session: AsyncSession,
        *,
        filters: Optional[AlertFilter] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[List[Alert], int]:
        return await alert_repo.list_filtered(
            session, filters=filters or AlertFilter(), page=page, per_page=per_page
        )

    async def get_alert(self, session: AsyncSession, alert_id: int) -> Alert:
        alert = await alert_repo.get(session, alert_id)
        if not alert:
            raise NotFoundError(detail="Alert not found")
        return alert

    async def update_status(
        self,
        session: AsyncSession,
        alert_id: int,
        status: str,
        *,
        acknowledged_by: Optional[int] = None,
    ) -> Alert:
        alert = await self.get_alert(session, alert_id)
        update = AlertUpdate(status=status)
        if acknowledged_by is not None:
            update.acknowledged_by = acknowledged_by
            update.acknowledged_at = datetime.now(timezone.utc)
        return await alert_repo.update(session, db_obj=alert, obj_in=update)


alert_service = AlertService()
