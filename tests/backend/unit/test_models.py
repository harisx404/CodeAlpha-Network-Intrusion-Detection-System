"""Unit tests for the ORM models."""

from datetime import UTC, datetime

from backend.core.constants import Severity
from backend.models import Alert, User


def test_user_model_creation():
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hash",
        role="analyst",
    )
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.role == "analyst"


def test_alert_model_uses_canonical_field_names():
    alert = Alert(
        timestamp=datetime.now(UTC),
        src_ip="1.1.1.1",
        dst_ip="2.2.2.2",
        protocol="TCP",
        signature="Test alert",
        signature_id=12345,
        severity=Severity.HIGH.value,
    )
    assert alert.src_ip == "1.1.1.1"
    assert alert.dst_ip == "2.2.2.2"
    assert alert.severity == "HIGH"
