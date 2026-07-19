# Architecture Deep Dive: CodeAlpha NIDS

The CodeAlpha Network Intrusion Detection System is engineered using a strictly **Layered Domain-Driven Design (DDD)** combined with an **event-driven asynchronous pipeline**. This architecture is designed specifically to handle high-throughput network events (e.g., volumetric DDoS, SYN floods) without exhausting system resources or causing the browser UI to lock up.

## 1. The Detection Layer (Suricata)

At the edge of the system sits **Suricata 7.0**. Suricata operates in IPS/IDS mode, bound directly to the host network interface via Docker `network_mode: host` and `privileged: true`.

- **Packet Inspection**: Suricata evaluates raw packets against loaded signatures (`custom.rules`, `local.rules`, Emerging Threats).
- **Output (EVE JSON)**: Instead of writing directly to a database (which introduces massive latency and locks), Suricata streams detections via Unix pipes to `/var/log/suricata/eve.json`.

## 2. The Ingestion Pipeline (Python / asyncio)

Log ingestion is fully asynchronous so the event loop is never blocked on file I/O.

- **`aiofiles` Tailing**: A background `asyncio` task (`eve_log_watcher.py`) tails `eve.json`, seeking to the end on startup so historical events aren't replayed.
- **Bounded Read Cycles**: Each read handles up to `BATCH_SIZE` (50) lines, then yields; when there's no new data it polls every 100ms. This keeps a single busy file from starving the loop.
- **Resilient Tailing**: The watcher detects log rotation via inode changes, waits for the file to appear if Suricata hasn't started, and skips malformed JSON lines instead of crashing.
- **Alert Forwarding**: Parsed `alert` events are handed to the alert manager; other EVE event types (dns, http, flow, stats) are parsed but not persisted as alerts.

## 3. The Core Backend (FastAPI / SQLAlchemy)

The Python backend is strictly segmented:

- **Routers (`backend/api/v1/routes/`)**: Handles incoming HTTP requests. Zero business logic.
- **Services (`backend/services/`)**: The "Domain" layer. Contains the rules for routing alerts, calculating threat scores, and triggering response handlers.
- **Repositories (`backend/repositories/`)**: The data access layer. Implements the Unit of Work pattern using SQLAlchemy `AsyncSession`. Database errors are trapped and mapped to clean `BaseNIDSError` exceptions.

## 4. The Real-Time Broadcast (WebSockets)

When the `AlertService` commits a new threat to the database, it fires an event to the `ConnectionManager`.
The `ConnectionManager` maintains an active registry of connected Next.js clients. It serializes the `Alert` Pydantic model into JSON and pushes it across the socket.

## 5. The Frontend (Next.js & Zustand)

The live feed is driven by a WebSocket hook and a shared Zustand store:
1. **WebSocket Hook**: `useWebSocket.ts` maintains the connection with exponential-backoff reconnection (1s up to 32s) and dispatches each incoming `new_alert` message into the store.
2. **Zustand Store**: `alertStore.ts` prepends new alerts, deduplicates by `id`, and caps the buffer at 1,000 entries so long-running sessions don't leak memory.
3. **Sliced Subscriptions**: Components subscribe to specific store slices (e.g., `useAlertStore(state => state.alerts)`), so only the components that use a given slice re-render when it changes.
