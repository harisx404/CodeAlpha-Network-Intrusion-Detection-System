"""Email response handler — notifies operators of critical alerts."""

import structlog
from backend.core.config import settings
from backend.core.constants import severity_at_least
from backend.response.base_handler import BaseResponseHandler, ResponseResult
from backend.schemas.alert import AlertResponse

log = structlog.get_logger(__name__)


class EmailHandler(BaseResponseHandler):
    @property
    def name(self) -> str:
        return "EmailHandler"

    def should_handle(self, alert: AlertResponse) -> bool:
        return settings.ENABLE_EMAIL_RESPONSE and severity_at_least(
            alert.severity, settings.EMAIL_MIN_SEVERITY
        )

    async def handle(self, alert: AlertResponse) -> ResponseResult:
        # SMTP delivery is not configured in this build. Rather than reporting a
        # send that never happened, record the notification as SKIPPED so the
        # audit trail stays truthful. Wire an SMTP client here to enable it.
        log.info(
            "email_notification_skipped",
            reason="SMTP not configured",
            signature=alert.signature,
            severity=alert.severity,
        )
        return ResponseResult(
            handler_name=self.name,
            action="email_notification",
            status="SKIPPED",
            details={
                "signature": alert.signature,
                "severity": alert.severity,
                "reason": "SMTP delivery not configured",
            },
        )
