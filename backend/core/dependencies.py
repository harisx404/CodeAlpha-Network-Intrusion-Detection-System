from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.database import async_session_factory

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for getting async DB session."""
    async with async_session_factory() as session:
        yield session
