from typing import List, Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging
from backend.core.event_bus import event_bus

logger = logging.getLogger(__name__)

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections.copy():
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error sending message to websocket: {e}")
                self.disconnect(connection)

manager = ConnectionManager()

async def handle_new_alert(payload: Dict[str, Any]):
    await manager.broadcast({"type": "new_alert", "data": payload})

# Subscribe to the event bus for new alerts
event_bus.subscribe("new_alert", handle_new_alert)

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We don't expect messages from the client, just keep the connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
