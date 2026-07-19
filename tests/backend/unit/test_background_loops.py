"""Unit tests for the statistics aggregator and IP-block cleanup logic."""

from datetime import datetime, timedelta, timezone

import pytest

from backend.models.alert import Alert
from backend.models.blocked_ip import BlockedIP
from backend.services.blocked_ip_service import BlockedIPService
from backend.services.statistics_service import StatisticsService


def _make_alert(severity: str, minutes_ago: int) -> Alert:
    ts = datetime.now(timezone.utc) - timedelta(minutes=minutes_ago)
    return Alert(
        timestamp=ts,
        severity=severity,
        status="NEW",
        category="TEST",
        signature_id=1,
        signature="test",
        src_ip="203.0.113.1",
        dst_ip="192.0.2.1",
        protocol="TCP",
    )


@pytest.mark.asyncio
async def test_aggregate_once_counts_only_alerts_in_window(db_session):
    # Two alerts inside a 60s window, one well outside it.
    db_session.add_all(
        [
            _make_alert("CRITICAL", minutes_ago=0),
            _make_alert("HIGH", minutes_ago=0),
            _make_alert("LOW", minutes_ago=30),
        ]
    )
    await db_session.commit()

    service = StatisticsService()
    snapshot = await service.aggregate_once(db_session, window_seconds=60)

    assert snapshot is not None
    assert snapshot.alerts_total == 2
    assert snapshot.alerts_critical == 1
    assert snapshot.alerts_high == 1


@pytest.mark.asyncio
async def test_aggregate_once_persists_row(db_session):
    service = StatisticsService()
    await service.aggregate_once(db_session, window_seconds=60)

    latest = await service.get_current_stats(db_session)
    assert latest is not None
    assert latest.alerts_total == 0  # no alerts, but a row is still written


@pytest.mark.asyncio
async def test_deactivate_expired_only_touches_past_expiries(db_session):
    now = datetime.now(timezone.utc)
    expired = BlockedIP(
        ip_address="10.0.0.1",
        reason="expired",
        expires_at=now - timedelta(minutes=5),
        is_active=True,
    )
    future = BlockedIP(
        ip_address="10.0.0.2",
        reason="active",
        expires_at=now + timedelta(hours=1),
        is_active=True,
    )
    permanent = BlockedIP(
        ip_address="10.0.0.3", reason="permanent", expires_at=None, is_active=True
    )
    db_session.add_all([expired, future, permanent])
    await db_session.commit()

    service = BlockedIPService()
    removed = await service.deactivate_expired(db_session)

    assert removed == 1
    active = await service.list_active(db_session)
    active_ips = {b.ip_address for b in active}
    assert active_ips == {"10.0.0.2", "10.0.0.3"}


@pytest.mark.asyncio
async def test_deactivate_expired_noop_when_nothing_expired(db_session):
    service = BlockedIPService()
    removed = await service.deactivate_expired(db_session)
    assert removed == 0
