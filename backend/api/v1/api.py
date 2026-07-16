from fastapi import APIRouter

from backend.api.v1.endpoints import (
    auth_router,
    alerts_router,
    events_router,
    rules_router,
    statistics_router,
)

api_router = APIRouter()
api_router.include_router(auth_router, tags=["login"])
api_router.include_router(alerts_router, prefix="/alerts", tags=["alerts"])
api_router.include_router(events_router, prefix="/events", tags=["events"])
api_router.include_router(rules_router, prefix="/rules", tags=["rules"])
api_router.include_router(statistics_router, prefix="/statistics", tags=["statistics"])
