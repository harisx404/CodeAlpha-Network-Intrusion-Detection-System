"""
Pytest fixtures for NIDS backend tests.

Uses in-memory SQLite database for isolation.
All repository/service dependencies are provided via DI.
"""

import os
import sys

# The application is imported as ``backend.*``. Ensure the repo root (two levels
# up from this file) is on sys.path so imports work regardless of the directory
# pytest is invoked from.
_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

# Provide deterministic settings for the test run so the suite never depends on
# a developer's local .env file. Set before the app/config module is imported.
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-not-for-production-use-only")
os.environ.setdefault("APP_ENV", "testing")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")

import asyncio  # noqa: E402
from httpx import AsyncClient, ASGITransport  # noqa: E402
from sqlalchemy.ext.asyncio import (  # noqa: E402
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

import pytest  # noqa: E402
import pytest_asyncio  # noqa: E402

from backend.core.database import Base, get_db  # noqa: E402
from backend.core.security import create_access_token  # noqa: E402
from backend.main import app  # noqa: E402

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop():
    """Override default pytest-asyncio event loop to session scope."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_engine():
    """Create an in-memory SQLite engine for each test."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def db_session(db_engine):
    """Provide an async database session with rollback after each test."""
    session_factory = async_sessionmaker(
        bind=db_engine, expire_on_commit=False, class_=AsyncSession
    )
    async with session_factory() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture(scope="function")
async def client(db_session):
    """HTTP test client with real in-memory database."""

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture
def auth_token() -> str:
    """Valid JWT access token for test user."""
    return create_access_token({"sub": "1", "role": "admin"})


@pytest.fixture
def auth_headers(auth_token: str) -> dict[str, str]:
    """Authorization headers for authenticated requests."""
    return {"Authorization": f"Bearer {auth_token}"}


def make_alert_data(**overrides) -> dict:
    """Factory for creating test alert data dicts."""
    defaults = {
        "id": 1,
        "timestamp": "2024-01-15T14:23:11+00:00",
        "severity": "HIGH",
        "status": "NEW",
        "category": "EXPLOIT",
        "signature_id": 2030450,
        "signature": "ET EXPLOIT Test Rule",
        "src_ip": "203.0.113.100",
        "src_port": 49152,
        "dst_ip": "192.0.2.50",
        "dst_port": 8080,
        "protocol": "TCP",
        "flow_id": "1847291847382",
        "geo_country": "Test Country",
        "geo_city": "Test City",
        "geo_lat": 0.0,
        "geo_lon": 0.0,
        "geo_org": "Test Org",
        "notes": "",
        "acknowledged_by": None,
        "acknowledged_at": None,
    }
    return {**defaults, **overrides}
