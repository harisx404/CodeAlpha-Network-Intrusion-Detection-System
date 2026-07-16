from .auth import router as auth_router
from .alerts import router as alerts_router
from .events import router as events_router
from .rules import router as rules_router
from .statistics import router as statistics_router

__all__ = ["auth_router", "alerts_router", "events_router", "rules_router", "statistics_router"]
