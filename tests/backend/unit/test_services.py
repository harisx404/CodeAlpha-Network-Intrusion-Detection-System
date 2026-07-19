"""Unit tests for the alert service layer."""

from unittest.mock import AsyncMock, patch

import pytest
from backend.models.alert import Alert
from backend.schemas.alert import AlertFilter
from backend.services.alert_service import alert_service


@pytest.mark.asyncio
async def test_get_alerts_delegates_to_repo_list_filtered():
    mock_session = AsyncMock()
    mock_alert = Alert(id=1, status="NEW")

    with patch("backend.services.alert_service.alert_repo") as mock_repo:
        mock_repo.list_filtered = AsyncMock(return_value=([mock_alert], 1))

        alerts, total = await alert_service.get_alerts(
            mock_session, filters=AlertFilter(), page=1, per_page=10
        )

        assert total == 1
        assert alerts[0].id == 1
        mock_repo.list_filtered.assert_called_once()


@pytest.mark.asyncio
async def test_update_status_fetches_then_updates():
    mock_session = AsyncMock()
    mock_alert = Alert(id=1, status="NEW")
    updated_alert = Alert(id=1, status="RESOLVED")

    with patch("backend.services.alert_service.alert_repo") as mock_repo:
        mock_repo.get = AsyncMock(return_value=mock_alert)
        mock_repo.update = AsyncMock(return_value=updated_alert)

        result = await alert_service.update_status(mock_session, 1, status="RESOLVED")

        assert result.status == "RESOLVED"
        mock_repo.get.assert_called_once_with(mock_session, 1)
        mock_repo.update.assert_called_once()


@pytest.mark.asyncio
async def test_update_status_raises_when_alert_missing():
    from backend.core.exceptions import NotFoundError

    mock_session = AsyncMock()
    with patch("backend.services.alert_service.alert_repo") as mock_repo:
        mock_repo.get = AsyncMock(return_value=None)

        with pytest.raises(NotFoundError):
            await alert_service.update_status(mock_session, 999, status="RESOLVED")
