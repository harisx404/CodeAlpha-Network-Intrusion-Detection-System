from fastapi import APIRouter, Depends, Query, status
from typing import Annotated, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.core.dependencies import CurrentUser, AnalystPlus
from backend.schemas.common import paginated, ok
from backend.schemas.rule import DetectionRuleResponse, DetectionRuleCreate, DetectionRuleUpdate
from backend.services.rule_service import rule_service

router = APIRouter()

@router.get("", summary="List all rules")
async def read_rules(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
) -> dict:
    """Retrieve detection rules."""
    skip = (page - 1) * per_page
    rules, total = await rule_service.get_rules(db, skip=skip, limit=per_page)
    return paginated(
        data=[DetectionRuleResponse.model_validate(r) for r in rules],
        page=page,
        per_page=per_page,
        total=total,
        message="Rules retrieved successfully",
    )

@router.post("", summary="Create a new rule")
async def create_rule(
    current_user: AnalystPlus,
    rule_in: DetectionRuleCreate,
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Create a new detection rule."""
    rule = await rule_service.create_rule(db, rule_in=rule_in)
    return ok(data=DetectionRuleResponse.model_validate(rule), message="Rule created successfully")

@router.put("/{rule_id}", summary="Update a rule")
async def update_rule(
    current_user: AnalystPlus,
    rule_id: int,
    rule_in: DetectionRuleUpdate,
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Update a detection rule."""
    rule = await rule_service.update_rule(db, rule_id=rule_id, rule_in=rule_in)
    return ok(data=DetectionRuleResponse.model_validate(rule), message="Rule updated successfully")

@router.delete("/{rule_id}", summary="Delete a rule")
async def delete_rule(
    current_user: AnalystPlus,
    rule_id: int,
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Delete a detection rule."""
    await rule_service.delete_rule(db, rule_id=rule_id)
    return ok(data=None, message="Rule deleted successfully")
