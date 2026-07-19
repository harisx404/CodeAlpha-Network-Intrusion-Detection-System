from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

import structlog

from backend.repositories import rule_repo
from backend.models.rule import DetectionRule
from backend.schemas.rule import DetectionRuleCreate, DetectionRuleUpdate
from backend.core.config import settings
from backend.core.exceptions import NotFoundError

log = structlog.get_logger(__name__)


def _append_to_file(body: str) -> None:
    try:
        with open(settings.SURICATA_RULES_PATH, "a") as f:
            f.write(f"\n{body}\n")
    except OSError as e:
        # The rules file lives inside the Suricata container; a missing path in
        # dev must not fail rule creation, so log and continue.
        log.warning("rule_file_write_failed", path=settings.SURICATA_RULES_PATH, error=str(e))


class RuleService:
    async def get_rules(self, session: AsyncSession, skip: int = 0, limit: int = 100) -> tuple[List[DetectionRule], int]:
        return await rule_repo.get_multi(session, skip=skip, limit=limit)

    async def create_rule(self, session: AsyncSession, rule_in: DetectionRuleCreate) -> DetectionRule:
        rule = await rule_repo.create(session, obj_in=rule_in)
        if rule_in.is_active:
            _append_to_file(rule_in.body)
        return rule

    async def update_rule(self, session: AsyncSession, rule_id: int, rule_in: DetectionRuleUpdate) -> DetectionRule:
        rule = await rule_repo.get(session, rule_id)
        if not rule:
            raise NotFoundError("Rule not found")
        return await rule_repo.update(session, db_obj=rule, obj_in=rule_in)

    async def delete_rule(self, session: AsyncSession, rule_id: int) -> None:
        rule = await rule_repo.get(session, rule_id)
        if not rule:
            raise NotFoundError("Rule not found")
        await rule_repo.remove(session, id=rule_id)


rule_service = RuleService()
