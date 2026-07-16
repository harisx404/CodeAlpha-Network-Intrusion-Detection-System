from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_db
from backend.services.statistics_service import statistics_service
from backend.schemas.statistics import TrafficStatisticsResponse

router = APIRouter()

@router.get("/current", response_model=TrafficStatisticsResponse)
async def read_current_statistics(
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Retrieve the latest traffic and alert statistics."""
    stats = await statistics_service.get_current_stats(db)
    if not stats:
        raise HTTPException(status_code=404, detail="Statistics not found")
    return stats
