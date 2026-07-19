"""Unit tests for the detection-rule service layer."""
import pytest

from backend.core.exceptions import NotFoundError
from backend.schemas.rule import DetectionRuleCreate, DetectionRuleUpdate
from backend.services.rule_service import rule_service


def _rule_data(**overrides) -> DetectionRuleCreate:
    defaults = dict(
        sid=1000010,
        name="Detect test traffic",
        body='alert http any any -> any any (msg:"Test"; sid:1000010;)',
        severity="HIGH",
        category="TEST",
        is_active=True,
    )
    return DetectionRuleCreate(**{**defaults, **overrides})


@pytest.mark.asyncio
async def test_create_rule_persists_with_schema_field_names(db_session):
    # Regression: create_rule previously read rule_in.enabled / rule_in.content,
    # which do not exist on the schema (is_active / body), raising AttributeError.
    rule = await rule_service.create_rule(db_session, rule_in=_rule_data())

    assert rule.id is not None
    assert rule.sid == 1000010
    assert rule.is_active is True
    assert rule.body.startswith("alert http")


@pytest.mark.asyncio
async def test_create_inactive_rule_skips_file_write(db_session):
    # An inactive rule must not attempt to append to the Suricata rules file.
    rule = await rule_service.create_rule(db_session, rule_in=_rule_data(is_active=False))
    assert rule.is_active is False


@pytest.mark.asyncio
async def test_delete_rule_removes_row(db_session):
    rule = await rule_service.create_rule(db_session, rule_in=_rule_data(sid=1000011))
    await rule_service.delete_rule(db_session, rule_id=rule.id)

    rules, total = await rule_service.get_rules(db_session)
    assert total == 0
    assert rules == []


@pytest.mark.asyncio
async def test_delete_missing_rule_raises(db_session):
    with pytest.raises(NotFoundError):
        await rule_service.delete_rule(db_session, rule_id=99999)


@pytest.mark.asyncio
async def test_update_rule_changes_fields(db_session):
    rule = await rule_service.create_rule(db_session, rule_in=_rule_data(sid=1000012))
    updated = await rule_service.update_rule(
        db_session, rule_id=rule.id, rule_in=DetectionRuleUpdate(is_active=False, name="Renamed")
    )
    assert updated.is_active is False
    assert updated.name == "Renamed"
