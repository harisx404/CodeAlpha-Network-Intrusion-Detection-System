"""API tests for the authentication endpoints."""

import pytest
from backend.core.security import get_password_hash
from backend.models.user import User


@pytest.fixture
async def login_user(db_session):
    """Insert an active user whose credentials the login tests exercise."""
    user = User(
        id=1,
        username="analyst",
        email="analyst@example.com",
        hashed_password=get_password_hash("s3cret-pass"),
        role="admin",
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    return user


@pytest.fixture
async def inactive_user(db_session):
    """Insert a user whose account has been deactivated."""
    user = User(
        id=2,
        username="retired",
        email="retired@example.com",
        hashed_password=get_password_hash("s3cret-pass"),
        role="analyst",
        is_active=False,
    )
    db_session.add(user)
    await db_session.commit()
    return user


@pytest.mark.asyncio
async def test_login_success_returns_token(client, login_user):
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": "analyst", "password": "s3cret-pass"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


@pytest.mark.asyncio
async def test_login_wrong_password_is_unauthorized(client, login_user):
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": "analyst", "password": "wrong-pass"},
    )

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_unknown_user_is_unauthorized_not_500(client):
    """A missing user must return 401 — never a 500, which would both break
    login and leak (via the status difference) which usernames exist."""
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": "ghost", "password": "whatever"},
    )

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_inactive_user_is_forbidden(client, inactive_user):
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": "retired", "password": "s3cret-pass"},
    )

    assert response.status_code == 403


@pytest.mark.asyncio
async def test_me_requires_authentication(client):
    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_returns_current_user(client, login_user):
    login = await client.post(
        "/api/v1/auth/login",
        data={"username": "analyst", "password": "s3cret-pass"},
    )
    token = login.json()["access_token"]

    response = await client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    body = response.json()
    assert body["username"] == "analyst"
    assert body["role"] == "admin"
