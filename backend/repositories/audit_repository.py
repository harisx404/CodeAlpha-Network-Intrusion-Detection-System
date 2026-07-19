from sqlalchemy.ext.asyncio import AsyncSession
from backend.repositories.base import BaseRepository
from backend.models.audit_log import AuditLog
from backend.schemas.audit import AuditLogCreate

class AuditRepository(BaseRepository[AuditLog, AuditLogCreate, AuditLogCreate]):
    async def log_action(self, db: AsyncSession, *, user_id: int, action: str, details: str, alert_id: int = None) -> AuditLog:
        obj_in = AuditLogCreate(user_id=user_id, action=action, details=details, alert_id=alert_id)
        return await self.create(session=db, obj_in=obj_in)

audit_repo = AuditRepository(AuditLog)
