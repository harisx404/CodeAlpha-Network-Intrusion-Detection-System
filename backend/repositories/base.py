from typing import Generic, TypeVar, Type, List, Optional, Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from backend.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, session: AsyncSession, id: int) -> Optional[ModelType]:
        result = await session.execute(select(self.model).filter(self.model.id == id))
        return result.scalars().first()

    async def get_multi(self, session: AsyncSession, *, skip: int = 0, limit: int = 100) -> tuple[List[ModelType], int]:
        """Returns items and total count."""
        from sqlalchemy import func
        count_query = select(func.count()).select_from(self.model)
        total = await session.scalar(count_query)
        
        query = select(self.model).offset(skip).limit(limit)
        result = await session.execute(query)
        return list(result.scalars().all()), total or 0

    async def create(self, session: AsyncSession, *, obj_in: CreateSchemaType | Dict[str, Any]) -> ModelType:
        obj_in_data = obj_in.model_dump() if isinstance(obj_in, BaseModel) else obj_in
        db_obj = self.model(**obj_in_data)
        session.add(db_obj)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj

    async def update(self, session: AsyncSession, *, db_obj: ModelType, obj_in: UpdateSchemaType | Dict[str, Any]) -> ModelType:
        obj_data = {c.name: getattr(db_obj, c.name) for c in db_obj.__table__.columns}
        update_data = obj_in.model_dump(exclude_unset=True) if isinstance(obj_in, BaseModel) else obj_in
        
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        
        session.add(db_obj)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj

    async def remove(self, session: AsyncSession, *, id: int) -> ModelType:
        obj = await self.get(session, id)
        if obj:
            await session.delete(obj)
            await session.commit()
        return obj
