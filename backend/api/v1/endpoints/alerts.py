from typing import Any, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_db
from backend.services.alert_service import alert_service
from backend.schemas.alert import AlertResponse, AlertUpdate
from backend.schemas.common import PaginatedResponse

router = APIRouter()

@router.get("/", response_model=PaginatedResponse[AlertResponse])
async def read_alerts(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
    severity: Optional[str] = None,
) -> Any:
    """Retrieve alerts."""
    alerts, total = await alert_service.get_alerts(db, skip=skip, limit=limit, severity=severity)
    return {
        "items": alerts,
        "total": total,
        "page": (skip // limit) + 1 if limit > 0 else 1,
        "size": limit,
        "pages": (total + limit - 1) // limit if limit > 0 else 1
    }

@router.put("/{alert_id}/status", response_model=AlertResponse)
async def update_alert_status(
    alert_id: int,
    alert_in: AlertUpdate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update an alert's status."""
    return await alert_service.update_status(db, alert_id=alert_id, status=alert_in.status)
