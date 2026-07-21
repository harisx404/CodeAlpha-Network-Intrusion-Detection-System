"""SQLAlchemy async database engine and session management."""

import os

from backend.core.config import settings
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""

    pass


# Engine — SQLite uses aiosqlite, PostgreSQL uses asyncpg
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # SQL logging only in debug mode
    pool_pre_ping=True,  # Check connections before use
    # SQLite-specific: connect_args not needed for aiosqlite
    # PostgreSQL: add pool_size=10, max_overflow=20
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Prevent lazy load errors after commit
    autocommit=False,
    autoflush=False,
)


async def create_tables() -> None:
    """Create all tables on startup (development only).

    In production, use Alembic migrations instead.
    This is a safety net for development environments.
    """
    if os.getenv("VERCEL") != "1":
        os.makedirs("database", exist_ok=True)
        os.makedirs("logs/app", exist_ok=True)
        os.makedirs("logs/detection", exist_ok=True)
        os.makedirs("logs/access", exist_ok=True)
        os.makedirs("logs/errors", exist_ok=True)
        os.makedirs("logs/audit", exist_ok=True)
        os.makedirs("logs/responses", exist_ok=True)
        
    async with engine.begin() as conn:
        if settings.APP_ENV != "production":
            await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncSession:  # type: ignore[return]
    """FastAPI dependency that yields an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
