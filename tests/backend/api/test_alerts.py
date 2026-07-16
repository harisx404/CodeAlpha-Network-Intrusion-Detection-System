import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app

@pytest.mark.asyncio
async def test_read_alerts_empty():
    from unittest.mock import patch
    
    with patch("backend.services.alert_service.alert_service.get_alerts") as mock_get:
        mock_get.return_value = ([], 0)
        
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.get("/api/v1/alerts/")
            
        assert response.status_code == 200
        assert response.json() == {
            "items": [],
            "total": 0,
            "page": 1,
            "size": 50,
            "pages": 1
        }
