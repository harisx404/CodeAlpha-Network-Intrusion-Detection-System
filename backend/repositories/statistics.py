from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from backend.models.statistics import TrafficStatistics
from backend.schemas.statistics import TrafficStatisticsCreate, TrafficStatisticsBase
from backend.repositories.base import BaseRepository

class StatisticsRepository(BaseRepository[TrafficStatistics, TrafficStatisticsCreate, TrafficStatisticsBase]):
    async def get_latest(self, session: AsyncSession) -> Optional[TrafficStatistics]:
        result = await session.execute(
            select(self.model).order_by(desc(self.model.timestamp)).limit(1)
        )
        return result.scalars().first()

statistics_repo = StatisticsRepository(TrafficStatistics)
