"""System administration routes — Suricata engine control and health checks."""

import asyncio

from backend.core.dependencies import AdminRole
from backend.detection.suricata_manager import SuricataManager
from backend.schemas.common import ok
from fastapi import APIRouter, HTTPException, status

router = APIRouter()


@router.post(
    "/suricata/reload", summary="Reload Suricata rules", dependencies=[AdminRole]
)
async def reload_suricata_rules() -> dict:
    """Ask the running Suricata engine to hot-reload its ruleset.

    Delegates to ``suricatasc``; returns 503 if the engine is unreachable
    (for example when the API runs without a co-located Suricata process).
    The blocking subprocess call runs in a worker thread so it never stalls
    the event loop.
    """
    reloaded = await asyncio.to_thread(SuricataManager.reload_rules)
    if not reloaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Suricata engine is not reachable — rules were not reloaded.",
        )
    return ok(data=None, message="Suricata rules reloaded successfully")


@router.get("/health", summary="Health check")
async def health_check() -> dict:
    """Liveness probe used by Docker and uptime monitors."""
    return {"status": "ok"}
