from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_db
from backend.services.rule_service import rule_service
from backend.schemas.rule import DetectionRuleResponse, DetectionRuleCreate, DetectionRuleUpdate
from backend.schemas.common import PaginatedResponse

router = APIRouter()

@router.get("/", response_model=PaginatedResponse[DetectionRuleResponse])
async def read_rules(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """Retrieve detection rules."""
    rules, total = await rule_service.get_rules(db, skip=skip, limit=limit)
    return {
        "items": rules,
        "total": total,
        "page": (skip // limit) + 1 if limit > 0 else 1,
        "size": limit,
        "pages": (total + limit - 1) // limit if limit > 0 else 1
    }

@router.post("/", response_model=DetectionRuleResponse)
async def create_rule(
    rule_in: DetectionRuleCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Create a new detection rule."""
    return await rule_service.create_rule(db, rule_in=rule_in)

@router.put("/{rule_id}", response_model=DetectionRuleResponse)
async def update_rule(
    rule_id: int,
    rule_in: DetectionRuleUpdate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update a detection rule."""
    return await rule_service.update_rule(db, rule_id=rule_id, rule_in=rule_in)
