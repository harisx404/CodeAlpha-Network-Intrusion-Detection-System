"""API tests for the alerts endpoints."""

import pytest
from backend.core.security import get_password_hash
from backend.models.user import User


@pytest.fixture
async def seeded_user(db_session):
    """Insert the user (id=1) that the auth_token fixture authenticates as."""
    user = User(
        id=1,
        username="analyst",
        email="analyst@example.com",
        hashed_password=get_password_hash("password"),
        role="admin",
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    return user


@pytest.mark.asyncio
async def test_list_alerts_requires_auth(client):
    response = await client.get("/api/v1/alerts")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_alerts_empty(client, seeded_user, auth_headers):
    response = await client.get("/api/v1/alerts", headers=auth_headers)

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"] == []
    assert body["meta"]["total"] == 0
    assert body["meta"]["page"] == 1
