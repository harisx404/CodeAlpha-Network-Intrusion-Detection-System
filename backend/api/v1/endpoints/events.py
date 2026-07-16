from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_db
from backend.repositories import event_repo
from backend.schemas.event import NetworkEventResponse
from backend.schemas.common import PaginatedResponse

router = APIRouter()

@router.get("/", response_model=PaginatedResponse[NetworkEventResponse])
async def read_events(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """Retrieve raw network events."""
    events, total = await event_repo.get_multi(db, skip=skip, limit=limit)
    return {
        "items": events,
        "total": total,
        "page": (skip // limit) + 1 if limit > 0 else 1,
        "size": limit,
        "pages": (total + limit - 1) // limit if limit > 0 else 1
    }
