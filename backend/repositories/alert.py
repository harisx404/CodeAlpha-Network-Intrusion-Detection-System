from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from backend.models.alert import Alert
from backend.schemas.alert import AlertCreate, AlertUpdate
from backend.repositories.base import BaseRepository

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

alert_repo = AlertRepository(Alert)
