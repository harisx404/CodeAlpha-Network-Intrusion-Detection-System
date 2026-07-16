from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from backend.models.rule import DetectionRule
from backend.schemas.rule import DetectionRuleCreate, DetectionRuleUpdate
from backend.repositories.base import BaseRepository

class RuleRepository(BaseRepository[DetectionRule, DetectionRuleCreate, DetectionRuleUpdate]):
    async def get_by_sid(self, session: AsyncSession, *, sid: int) -> Optional[DetectionRule]:
        result = await session.execute(select(self.model).filter(self.model.sid == sid))
        return result.scalars().first()

rule_repo = RuleRepository(DetectionRule)
