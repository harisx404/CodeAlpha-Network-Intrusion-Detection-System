"""
NIDS FastAPI Application Factory.

Configures the application with lifespan management, middleware stack,
and router registration for all API endpoints.
"""

import asyncio
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import structlog
from backend.api.v1.routes import (
    alerts,
    auth,
    rules,
    statistics,
    system,
)
from backend.api.websocket.handlers import websocket_router
from backend.core.config import settings
from backend.core.database import create_tables
from backend.core.logging import setup_logging
from backend.detection.alert_manager import AlertManager
from backend.detection.eve_log_watcher import EVELogWatcher
from backend.detection.geoip_enricher import GeoIPEnricher
from backend.middleware.error_handler import register_exception_handlers
from backend.middleware.rate_limiter import RateLimiterMiddleware
from backend.middleware.request_logger import RequestLoggerMiddleware
from backend.response.response_engine import ResponseEngine
from backend.services.blocked_ip_service import BlockedIPService
from backend.services.statistics_service import StatisticsService
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

log = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager — startup and shutdown."""
    setup_logging()
    log.info("nids_starting", version="1.0.0", env=settings.APP_ENV)

    # Initialize core components
    await create_tables()

    # Seed demo data on first run (controlled by SEED_DEMO_DATA env var).
    # Idempotent — safe to run on every restart.
    import os
    if os.getenv("SEED_DEMO_DATA", "true").lower() == "true":
        try:
            from backend.database.seed import seed_db
            await seed_db()
        except Exception as exc:  # pragma: no cover - seeding must never block startup
            log.warning("demo_seed_failed", error=str(exc))


    geoip = GeoIPEnricher(settings.GEOIP_DB_PATH)

    alert_manager = AlertManager(geoip_enricher=geoip)
    response_engine = ResponseEngine()
    stats_service = StatisticsService()
    blocked_ip_service = BlockedIPService()

    # Wire response engine to event bus
    response_engine.start()
    background_tasks = []

    # Start background tasks ONLY if we are NOT on Vercel Serverless
    if os.getenv("VERCEL") != "1":
        watcher = EVELogWatcher(
            filepath=settings.SURICATA_LOG_PATH,
            alert_manager=alert_manager.process_parsed_alert,
        )
        background_tasks.extend([
            asyncio.create_task(watcher.start(), name="eve_watcher"),
            # Persist a traffic-statistics snapshot every 60 seconds.
            asyncio.create_task(
                stats_service.run_aggregator_loop(interval_seconds=60),
                name="stats_aggregator",
            ),
            # Expire stale IP blocks every 5 minutes.
            asyncio.create_task(
                blocked_ip_service.run_cleanup_loop(interval_seconds=300),
                name="ip_block_cleanup",
            ),
        ])

        # Auto-Simulator for Cloud "Deploy and Forget" mode
        if os.getenv("DEMO_MODE", "true").lower() == "true":
            from backend.detection.demo_simulator import DemoSimulator
            demo = DemoSimulator(callback=alert_manager.process_parsed_alert)
            demo_task = asyncio.create_task(demo.start(), name="demo_simulator")
            background_tasks.append(demo_task)
    else:
        log.info("vercel_serverless_mode", message="Background tasks disabled for Serverless compatibility")

    log.info("nids_started")
    yield  # Application is running

    # Graceful shutdown
    log.info("nids_shutting_down")
    watcher.stop()
    for task in background_tasks:
        task.cancel()
    await asyncio.gather(*background_tasks, return_exceptions=True)
    log.info("nids_stopped")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="IntruShield NIDS API",
        description="IntruShield Network Intrusion Detection System — Autonomous Threat Telemetry & SOC Engine",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # ── Middleware (order matters: outermost first) ──────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.get_cors_origins(),
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
        max_age=3600,
    )
    app.add_middleware(RateLimiterMiddleware)
    app.add_middleware(RequestLoggerMiddleware)

    # ── Exception handlers ───────────────────────────────────────────────
    register_exception_handlers(app)

    # ── Routers ──────────────────────────────────────────────────────────
    prefix = "/api/v1"
    app.include_router(auth.router, prefix=f"{prefix}/auth", tags=["Authentication"])
    app.include_router(alerts.router, prefix=f"{prefix}/alerts", tags=["Alerts"])
    app.include_router(rules.router, prefix=f"{prefix}/rules", tags=["Detection Rules"])
    app.include_router(
        statistics.router, prefix=f"{prefix}/statistics", tags=["Statistics"]
    )
    app.include_router(system.router, prefix=f"{prefix}/system", tags=["System"])
    app.include_router(websocket_router)  # WebSocket at /ws/events

    return app


app = create_app()
