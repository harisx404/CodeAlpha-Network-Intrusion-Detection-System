"""Repository for alert persistence and querying."""
from datetime import datetime
from typing import List, Optional

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.alert import Alert
from backend.repositories.base import BaseRepository
from backend.schemas.alert import AlertCreate, AlertFilter, AlertUpdate


class AlertRepository(BaseRepository[Alert, AlertCreate, AlertUpdate]):
    async def get_recent_alerts(
        self, session: AsyncSession, *, limit: int = 50, severity: Optional[str] = None
    ) -> List[Alert]:
        query = select(self.model).order_by(desc(self.model.timestamp))
        if severity:
            query = query.filter(self.model.severity == severity)
        query = query.limit(limit)
        result = await session.execute(query)
        return list(result.scalars().all())

    async def list_filtered(
        self,
        session: AsyncSession,
        *,
        filters: AlertFilter,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[List[Alert], int]:
        """Return a page of alerts matching the filters, plus the total count."""
        conditions = self._build_conditions(filters)

        count_query = select(func.count()).select_from(self.model)
        for cond in conditions:
            count_query = count_query.where(cond)
        total = await session.scalar(count_query) or 0

        query = select(self.model).order_by(desc(self.model.timestamp))
        for cond in conditions:
            query = query.where(cond)
        query = query.offset((page - 1) * per_page).limit(per_page)
        result = await session.execute(query)
        return list(result.scalars().all()), total

    def _build_conditions(self, filters: AlertFilter) -> list:
        conditions = []
        if filters.severity:
            conditions.append(self.model.severity == filters.severity)
        if filters.status:
            conditions.append(self.model.status == filters.status)
        if filters.src_ip:
            conditions.append(self.model.src_ip == filters.src_ip)
        if filters.start_date:
            conditions.append(self.model.timestamp >= _parse_date(filters.start_date))
        if filters.end_date:
            conditions.append(self.model.timestamp <= _parse_date(filters.end_date))
        return conditions


def _parse_date(value: str) -> datetime:
    """Parse an ISO date/datetime string, tolerating a trailing Z."""
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


alert_repo = AlertRepository(Alert)
