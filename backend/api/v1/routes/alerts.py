"""Alert routes — list, inspect, and update the status of security alerts."""

from typing import Annotated

from backend.core.constants import AlertStatus
from backend.core.database import get_db
from backend.core.dependencies import AnalystPlus, CurrentUser
from backend.schemas.alert import AlertFilter, AlertResponse
from backend.schemas.common import ok, paginated
from backend.services.alert_service import alert_service
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("", summary="List all alerts with filtering and pagination")
async def list_alerts(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=1000),
    severity: str | None = Query(default=None),
    status: str | None = Query(default=None),
    src_ip: str | None = Query(default=None),
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
) -> dict:
    """Retrieve paginated alerts with optional filtering."""
    filters = AlertFilter(
        severity=severity,
        status=status,
        src_ip=src_ip,
        start_date=start_date,
        end_date=end_date,
    )
    alerts, total = await alert_service.get_alerts(
        db, filters=filters, page=page, per_page=per_page
    )
    return paginated(
        data=[AlertResponse.model_validate(a) for a in alerts],
        page=page,
        per_page=per_page,
        total=total,
        message="Alerts retrieved successfully",
    )


@router.get("/{alert_id}", summary="Get a single alert by id")
async def get_alert(
    current_user: CurrentUser,
    alert_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """Retrieve one alert with its full detail."""
    alert = await alert_service.get_alert(db, alert_id)
    return ok(
        data=AlertResponse.model_validate(alert), message="Alert retrieved successfully"
    )


@router.post("/{alert_id}/acknowledge", summary="Acknowledge an alert")
async def acknowledge_alert(
    current_user: AnalystPlus,
    alert_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """Mark an alert as acknowledged by the current analyst."""
    alert = await alert_service.update_status(
        db,
        alert_id,
        status=AlertStatus.ACKNOWLEDGED.value,
        acknowledged_by=current_user.id,
    )
    return ok(data=AlertResponse.model_validate(alert), message="Alert acknowledged")


@router.post("/{alert_id}/resolve", summary="Resolve an alert")
async def resolve_alert(
    current_user: AnalystPlus,
    alert_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """Mark an alert as resolved."""
    alert = await alert_service.update_status(
        db, alert_id, status=AlertStatus.RESOLVED.value
    )
    return ok(data=AlertResponse.model_validate(alert), message="Alert resolved")
