# System Architecture

## Core Components
1. **Suricata**: Listens on network interfaces and logs matches to `eve.json`.
2. **Watchdog**: Asynchronously tails `eve.json` and pushes new lines to the parser.
3. **Event Bus**: In-memory pub/sub that decouples detection from response.
4. **WebSocket Manager**: Streams alerts directly to the connected Next.js clients.

## Database
Uses SQLite in development and PostgreSQL in production. ORM is asynchronous SQLAlchemy 2.0.
