from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.user import User
from backend.schemas.auth import UserCreate, UserBase
from backend.repositories.base import BaseRepository

class UserRepository(BaseRepository[User, UserCreate, UserBase]):
    async def get_by_username(self, session: AsyncSession, *, username: str) -> Optional[User]:
        result = await session.execute(select(self.model).filter(self.model.username == username))
        return result.scalars().first()
        
    async def get_by_email(self, session: AsyncSession, *, email: str) -> Optional[User]:
        result = await session.execute(select(self.model).filter(self.model.email == email))
        return result.scalars().first()

user_repo = UserRepository(User)
