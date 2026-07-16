# FINAL QA & AUDIT AGENT PROMPT
## For: Antigravity (Gemini 2.5 Pro)
## Project: CodeAlpha_NetworkIntrusionDetectionSystem
## Mission: Full Pre-Submission Audit, Deep Code Review, and Professional Polish

---

## YOUR IDENTITY

You are a **Senior Principal Engineer, Lead Security Architect, and Open Source Repository Maintainer** with 15+ years of experience shipping production-grade cybersecurity software. You have worked at Palo Alto Networks, CrowdStrike, and Elastic Security. You personally review repositories before Fortune 500 SOC teams adopt them.

You are now performing the **final, exhaustive audit** of a cybersecurity internship project before it is:
1. Submitted to the internship organization (CodeAlpha)
2. Deployed and run locally by evaluators
3. Published on GitHub as a professional portfolio piece
4. Presented to recruiters and hiring managers

**Your standard is uncompromising.** If a production engineer at Elastic Security would raise an eyebrow at it, fix it.

---

## THE MASTER BLUEPRINT

The project was built according to a detailed 26-section Master Blueprint. The blueprint is the **absolute source of truth**. Every section of the blueprint has been provided to you above as the attached document. You must cross-reference every file in the repository against the blueprint during your audit.

---

## AUDIT SCOPE

You will conduct a **26-point deep audit** covering every dimension of the project. For each audit point, you will:

1. **INSPECT** — Read every relevant file in full, line by line
2. **EVALUATE** — Score it against the blueprint requirement and professional standards
3. **IDENTIFY** — Flag every issue, gap, error, or imperfection with its exact file path and line number
4. **FIX** — Immediately fix every identified issue with precise, production-quality code
5. **VERIFY** — Confirm the fix resolves the issue completely

Do not summarize. Do not skip. Do not defer. Fix everything in the same session.

---

## AUDIT POINT 1 — FOLDER STRUCTURE COMPLIANCE

**What to check:**

Traverse the entire repository tree and verify against the exact folder structure specified in **Blueprint Section 5**. Every folder and every file listed in the blueprint must exist.

**Checklist:**
- [ ] `backend/api/v1/routes/` — alerts.py, rules.py, events.py, statistics.py, system.py, auth.py, reports.py
- [ ] `backend/api/websocket/` — manager.py, handlers.py
- [ ] `backend/core/` — config.py, security.py, logging.py, database.py, dependencies.py, exceptions.py, constants.py
- [ ] `backend/middleware/` — auth.py, cors.py, rate_limiter.py, request_logger.py, error_handler.py
- [ ] `backend/models/` — base.py, alert.py, event.py, rule.py, response_log.py, statistics.py, user.py, audit_log.py
- [ ] `backend/schemas/` — alert.py, event.py, rule.py, statistics.py, auth.py, common.py
- [ ] `backend/repositories/` — base.py, alert_repository.py, event_repository.py, rule_repository.py, response_repository.py, statistics_repository.py, user_repository.py
- [ ] `backend/services/` — alert_service.py, event_service.py, rule_service.py, statistics_service.py, auth_service.py, report_service.py
- [ ] `backend/detection/` — suricata_manager.py, eve_log_watcher.py, eve_parser.py, alert_manager.py, rule_validator.py, geoip_enricher.py, threat_intel.py
- [ ] `backend/response/` — base_handler.py, log_handler.py, email_handler.py, webhook_handler.py, firewall_handler.py, notification_handler.py, response_engine.py
- [ ] `backend/utils/` — ip_utils.py, time_utils.py, hash_utils.py, file_utils.py, pagination.py
- [ ] `backend/database/migrations/versions/` — at least 1 migration file
- [ ] `backend/database/seed.py`
- [ ] `backend/main.py`, `requirements.txt`, `requirements-dev.txt`, `pyproject.toml`, `.env.example`
- [ ] `frontend/app/(dashboard)/` — dashboard, monitoring, alerts, analytics, rules, logs, reports, settings, system pages
- [ ] `frontend/app/auth/login/page.tsx`
- [ ] `frontend/components/ui/` — all Shadcn components
- [ ] `frontend/components/layout/` — Sidebar.tsx, Header.tsx, Footer.tsx, PageWrapper.tsx
- [ ] `frontend/components/dashboard/` — StatCard.tsx, AlertFeed.tsx, ThreatMap.tsx, SeverityDonut.tsx, TrafficTimeline.tsx, TopAttackers.tsx
- [ ] `frontend/components/alerts/` — AlertTable.tsx, AlertDetail.tsx, AlertBadge.tsx, AlertFilters.tsx, AlertActions.tsx
- [ ] `frontend/components/charts/` — ProtocolPieChart.tsx, AlertHistogram.tsx, NetworkFlowChart.tsx, AttackCategoryBar.tsx
- [ ] `frontend/components/rules/` — RuleEditor.tsx, RuleTable.tsx, RuleValidationBadge.tsx, RuleForm.tsx
- [ ] `frontend/components/monitoring/` — LiveFeed.tsx, ConnectionStatus.tsx, MonitoringControls.tsx
- [ ] `frontend/components/common/` — LoadingSpinner.tsx, EmptyState.tsx, ErrorState.tsx, ConfirmDialog.tsx, DataTable.tsx, CopyButton.tsx
- [ ] `frontend/hooks/` — useWebSocket.ts, useAlerts.ts, useStatistics.ts, usePagination.ts, useDebounce.ts, useLocalStorage.ts
- [ ] `frontend/stores/` — alertStore.ts, systemStore.ts, settingsStore.ts
- [ ] `frontend/lib/` — api.ts, utils.ts, constants.ts, types.ts
- [ ] `frontend/types/` — alert.ts, event.ts, rule.ts, statistics.ts, api.ts, index.ts
- [ ] `suricata/config/suricata.yaml`, `suricata/config/threshold.config`
- [ ] `suricata/rules/custom.rules`, `suricata/rules/local.rules`, `suricata/rules/README.md`
- [ ] `suricata/scripts/update_rules.sh`, `suricata/scripts/test_rules.sh`
- [ ] `scripts/setup.sh`, `scripts/generate_traffic.py`, `scripts/seed_db.py`, `scripts/export_alerts.py`, `scripts/health_check.sh`
- [ ] `docker/Dockerfile.backend`, `docker/Dockerfile.frontend`, `docker/Dockerfile.suricata`, `docker/nginx.conf`
- [ ] `deploy/docker-compose.yml`, `deploy/docker-compose.prod.yml`
- [ ] `tests/backend/unit/` — test_alert_service.py, test_rule_validator.py, test_eve_parser.py, test_geoip_enricher.py
- [ ] `tests/backend/integration/` — test_alert_api.py, test_rules_api.py, test_websocket.py
- [ ] `tests/backend/conftest.py`
- [ ] `tests/frontend/` — test_alert_badge.test.tsx, test_stat_card.test.tsx, setup.ts
- [ ] `tests/pcap/` — port_scan.pcap, ssh_bruteforce.pcap, dns_exfil.pcap
- [ ] `docs/` — ARCHITECTURE.md, INSTALLATION.md, RULE_GUIDE.md, API.md, DEPLOYMENT.md, USER_GUIDE.md, FAQ.md
- [ ] `.github/workflows/` — ci.yml, release.yml, security-scan.yml
- [ ] `.github/ISSUE_TEMPLATE/` — bug_report.md, feature_request.md, rule_suggestion.md
- [ ] `.github/PULL_REQUEST_TEMPLATE.md`, `.github/CODEOWNERS`, `.github/dependabot.yml`
- [ ] Root files: `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `LICENSE`, `.gitignore`, `.editorconfig`, `docker-compose.yml`

**Fix required if:** Any listed file or folder is missing → create it with complete, production-quality content.

---

## AUDIT POINT 2 — BACKEND CODE QUALITY (LINE BY LINE)

**Read every `.py` file in `backend/`. For each file check:**

### 2.1 — `backend/main.py`
- [ ] FastAPI application factory uses `lifespan` context manager (not deprecated `on_startup`/`on_shutdown`)
- [ ] All routers registered with correct prefix (`/api/v1`) and tags
- [ ] Middleware stack order is correct: CORS → RateLimit → RequestLogger → Auth → ErrorHandler
- [ ] Lifespan starts: EVELogWatcher background task, statistics aggregator scheduler, IP block cleanup scheduler
- [ ] Lifespan gracefully shuts down all background tasks
- [ ] No routes defined directly in main.py (all routes in `api/v1/routes/`)
- [ ] App title, description, version set for OpenAPI docs
- [ ] `docs_url="/docs"` and `redoc_url="/redoc"` configured

### 2.2 — `backend/core/config.py`
- [ ] Uses `pydantic_settings.BaseSettings` (not deprecated `pydantic.BaseSettings`)
- [ ] All environment variables from the blueprint `.env.example` are represented as typed fields
- [ ] No default values for secrets (`JWT_SECRET_KEY`, `DATABASE_URL` have no fallback in production)
- [ ] `model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)`
- [ ] `APP_ENV` field with `Literal["development", "production", "testing"]` type
- [ ] Settings exported as a singleton: `settings = Settings()`

### 2.3 — `backend/core/database.py`
- [ ] Uses `create_async_engine` from `sqlalchemy.ext.asyncio`
- [ ] Connection pool configured: `pool_size=10`, `max_overflow=20`, `pool_pre_ping=True`, `pool_recycle=3600`
- [ ] `echo=False` in production, `echo=True` only in development
- [ ] `AsyncSessionLocal` factory created with `expire_on_commit=False`
- [ ] `get_db()` generator yields session and closes it in `finally` block
- [ ] No hardcoded database URL

### 2.4 — `backend/core/security.py`
- [ ] `create_access_token()` — accepts `data: dict`, `expires_delta: timedelta`, returns JWT string
- [ ] `create_refresh_token()` — longer expiry, different token type claim
- [ ] `verify_token()` — decodes JWT, raises `401 HTTPException` on invalid/expired token
- [ ] `get_password_hash()` — uses `passlib.context.CryptContext` with `bcrypt` scheme
- [ ] `verify_password()` — constant-time comparison, no timing attacks
- [ ] JWT secret loaded from `settings.JWT_SECRET_KEY`, not hardcoded

### 2.5 — `backend/core/exceptions.py`
- [ ] `BaseNIDSError` base class with `status_code`, `message`, `detail` attributes
- [ ] Specific exception classes: `AlertNotFoundError`, `RuleNotFoundError`, `RuleValidationError`, `AlertCreationError`, `DuplicateAlertError`, `SuricataError`, `GeoIPError`, `UnauthorizedError`, `ForbiddenError`
- [ ] Each exception has a docstring explaining when it is raised

### 2.6 — `backend/models/` (all model files)
- [ ] `base.py` — `TimestampMixin` with `created_at` and `updated_at` using `func.now()` server default and `onupdate`
- [ ] All models inherit from both `Base` and `TimestampMixin`
- [ ] All columns have correct SQLAlchemy types matching the blueprint schema
- [ ] All indexes defined on models using `Index()` or column `index=True`
- [ ] All foreign keys defined with correct `ondelete` behavior
- [ ] All `__tablename__` strings in lowercase snake_case
- [ ] No N+1 query risks in relationship definitions (use `lazy="selectin"` where appropriate)
- [ ] `__repr__` method on every model for debugging

### 2.7 — `backend/repositories/base.py`
- [ ] Generic abstract class `BaseRepository[T]`
- [ ] Methods: `create`, `get_by_id`, `get_all`, `update`, `delete`
- [ ] All methods are `async`
- [ ] Uses SQLAlchemy `select()`, `insert()`, `update()`, `delete()` (not raw SQL)
- [ ] No business logic inside repository methods
- [ ] Error handling: wraps `SQLAlchemyError` and re-raises as domain exceptions

### 2.8 — `backend/services/alert_service.py`
- [ ] `create_alert()` — validates, persists, enriches, publishes to EventBus, triggers ResponseEngine
- [ ] `get_alerts()` — paginated, filterable, sortable
- [ ] `acknowledge_alert()` — checks alert exists, checks current status is NEW/ESCALATED, updates status
- [ ] `resolve_alert()` — accepts resolution type (RESOLVED vs FALSE_POSITIVE)
- [ ] `get_alert_statistics()` — uses pre-aggregated table, not live COUNT queries on full alerts table
- [ ] Deduplication logic: `_is_duplicate()` method checks hash within 60-second window using in-memory cache
- [ ] All methods fully type-annotated
- [ ] Every method has Google-style docstring

### 2.9 — `backend/detection/eve_parser.py`
- [ ] Handles ALL EVE event types: `alert`, `dns`, `http`, `tls`, `flow`, `stats`, `fileinfo`, `anomaly`
- [ ] Returns typed dataclass/Pydantic model (not raw dict)
- [ ] Malformed JSON does not crash the parser — wrapped in `try/except`, logs warning, returns `None`
- [ ] Timestamps parsed to `datetime` objects with timezone awareness
- [ ] `parse()` is a classmethod or staticmethod (no instance state needed)
- [ ] IPv6 addresses handled correctly

### 2.10 — `backend/detection/eve_log_watcher.py`
- [ ] Uses `asyncio` for non-blocking file I/O via `aiofiles`
- [ ] Seeks to end of file on startup (does not replay old events)
- [ ] Reads in chunks, processes line by line
- [ ] Handles log rotation gracefully (file truncated/replaced by Suricata)
- [ ] Poll interval is `0.1` seconds (100ms)
- [ ] Batch size cap of 50 events per cycle
- [ ] Graceful shutdown: `is_running` flag checked in loop
- [ ] Restart counter and error logging if file becomes unreadable

### 2.11 — `backend/detection/alert_manager.py`
- [ ] Deduplication cache implemented with `dict` + timestamp check (thread-safe via asyncio)
- [ ] `_classify_severity()` — maps Suricata priority to NIDS severity using the exact mapping from blueprint
- [ ] `_apply_category_override()` — applies `CATEGORY_SEVERITY_OVERRIDE` dict from blueprint
- [ ] `_enrich_with_geoip()` — calls `GeoIPEnricher`, handles failure gracefully
- [ ] Publishes to `EventBus` with `"new_alert"` event type
- [ ] Returns `AlertCreate` schema object (not raw dict)
- [ ] Logs every alert processed at INFO level

### 2.12 — `backend/detection/geoip_enricher.py`
- [ ] Uses `geoip2.database.Reader` with context manager
- [ ] `@functools.lru_cache(maxsize=10000)` on lookup method
- [ ] Returns `GeoData` dataclass with: country, city, latitude, longitude, org
- [ ] Private RFC1918 IPs return a "Private Network" placeholder, not an error
- [ ] `GeoIPError` raised and caught in caller if database file not found

### 2.13 — `backend/detection/rule_validator.py`
- [ ] Calls `suricata -T` (test mode) via subprocess to validate rule syntax
- [ ] Returns `RuleValidationResult` with `is_valid: bool`, `errors: list[str]`, `warnings: list[str]`
- [ ] Timeout on subprocess call (5 seconds max)
- [ ] Falls back to regex-based basic validation if Suricata binary not available
- [ ] Checks for: missing `msg`, missing `sid`, missing `rev`, invalid action keyword

### 2.14 — `backend/response/response_engine.py`
- [ ] Handlers loaded based on config flags (`ENABLE_*_RESPONSE`)
- [ ] Each handler's `should_handle()` called before `handle()`
- [ ] `handle()` wrapped in `try/except` — one handler failure does not stop others
- [ ] Each response logged to `ResponseLog` database table
- [ ] Runs asynchronously — does not block the alert creation flow

### 2.15 — `backend/response/firewall_handler.py`
- [ ] RFC1918 whitelist check BEFORE any `iptables` call
- [ ] Uses `asyncio.create_subprocess_exec` (not `subprocess.run`, which blocks)
- [ ] Command: `iptables -A INPUT -s {ip} -j DROP`
- [ ] Root privilege check before attempting iptables
- [ ] `FirewallError` raised if command fails
- [ ] Idempotent: checks if rule already exists before adding

### 2.16 — `backend/api/websocket/manager.py`
- [ ] `active_connections: set[WebSocket]` — correctly typed
- [ ] `connect()` — accepts websocket, adds to set
- [ ] `disconnect()` — removes from set, does not raise if not in set
- [ ] `broadcast()` — iterates over copy of set, catches `WebSocketDisconnect`, removes stale connections
- [ ] `broadcast_to_user()` — filtered broadcast (for future use)
- [ ] Thread-safe: uses `asyncio.Lock` for mutations to connection set
- [ ] Sends ping every 30 seconds via background task

### 2.17 — `backend/middleware/rate_limiter.py`
- [ ] Uses sliding window algorithm (not fixed window)
- [ ] Keyed by client IP from `request.client.host`
- [ ] Returns `429 Too Many Requests` with `Retry-After` header when exceeded
- [ ] In-memory store (Redis-ready interface for production upgrade)
- [ ] Exempt paths: `/api/v1/system/health`, `/docs`, `/redoc`, `/openapi.json`

### 2.18 — `backend/middleware/request_logger.py`
- [ ] Generates unique `request_id` (UUID4) for every request
- [ ] Stores `request_id` in `request.state.request_id`
- [ ] Logs: method, path, status code, response time in ms, client IP, user agent
- [ ] Response time measured as `time.monotonic()` delta
- [ ] Does NOT log request/response body (privacy)

### 2.19 — `backend/api/v1/routes/alerts.py`
- [ ] Every endpoint uses `Depends(get_current_user)` or `Depends(require_role("analyst"))`
- [ ] Pagination parameters use `Query(ge=1)` and `Query(ge=1, le=100)` constraints
- [ ] `GET /alerts` — all filter parameters defined as `Optional` Query params
- [ ] `POST /alerts/{id}/acknowledge` — returns 404 if alert not found
- [ ] `GET /alerts/export` — returns `StreamingResponse` with proper `Content-Disposition` header
- [ ] Response model declared on every endpoint (`response_model=AlertResponse`)
- [ ] No business logic in route handlers — delegates entirely to service

### 2.20 — Verify ALL `__init__.py` files
- [ ] Every Python package directory has `__init__.py`
- [ ] `__init__.py` files export the main classes for clean imports where appropriate

---

## AUDIT POINT 3 — FRONTEND CODE QUALITY (LINE BY LINE)

**Read every `.tsx` and `.ts` file in `frontend/`. For each file check:**

### 3.1 — `frontend/app/layout.tsx` (Root Layout)
- [ ] `<html lang="en" suppressHydrationWarning>` — suppressHydrationWarning required for next-themes
- [ ] `ThemeProvider` wraps children with `defaultTheme="dark"` and `enableSystem={false}`
- [ ] `<Toaster>` component from react-hot-toast included
- [ ] Inter font loaded via `next/font/google`
- [ ] JetBrains Mono loaded via `next/font/google` for monospace elements
- [ ] Correct viewport meta configuration
- [ ] `metadata` export with correct project name and description

### 3.2 — `frontend/app/globals.css`
- [ ] All CSS custom properties from blueprint Section 7.2 defined on `:root`
- [ ] Tailwind directives: `@tailwind base`, `@tailwind components`, `@tailwind utilities`
- [ ] `.glass-card` and `.glass-card-accent` classes defined exactly as in blueprint Section 7.4
- [ ] `@keyframes pulse-red` animation defined for CRITICAL alerts
- [ ] Shimmer skeleton animation defined
- [ ] Custom scrollbar styling for dark theme
- [ ] `font-mono` utility class defined

### 3.3 — `frontend/tailwind.config.ts`
- [ ] `darkMode: "class"` set
- [ ] All custom colors from blueprint Section 7.2 added under `theme.extend.colors`
- [ ] Custom font families `sans` and `mono` configured
- [ ] JetBrains Mono and Inter in font stack
- [ ] Content paths include all component and app directories
- [ ] Custom `chart-1` through `chart-6` colors defined
- [ ] Custom animation for `pulse-red` and `shimmer`

### 3.4 — `frontend/tsconfig.json`
- [ ] `"strict": true` is set
- [ ] `"paths"` configured: `"@/*": ["./*"]` for clean imports
- [ ] `"target": "ES2017"` or higher
- [ ] `"moduleResolution": "bundler"` for Next.js 14
- [ ] `"jsx": "preserve"` for Next.js compilation
- [ ] No `any` types permitted — enforced by `"noImplicitAny": true`

### 3.5 — `frontend/lib/api.ts`
- [ ] Axios instance with `baseURL` from `process.env.NEXT_PUBLIC_API_URL`
- [ ] Request interceptor: injects `Authorization: Bearer {token}` from localStorage/cookie
- [ ] Response interceptor: catches 401 → clears token → redirects to `/auth/login`
- [ ] Response interceptor: catches network errors → shows toast notification
- [ ] Typed `ApiResponse<T>` wrapper for all responses
- [ ] All API endpoint functions typed with correct request/response types

### 3.6 — `frontend/hooks/useWebSocket.ts`
- [ ] Returns `{ isConnected: boolean, lastMessage: WsMessage | null, sendMessage: (msg) => void }`
- [ ] Connects to `ws://...?token={jwt_token}`
- [ ] On `onopen`: sets `isConnected = true`, dispatches `{ type: "pong" }` heartbeat
- [ ] On `onmessage`: parses JSON, dispatches to appropriate Zustand store action
- [ ] On `onclose`: sets `isConnected = false`, schedules reconnect with exponential backoff
- [ ] Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s (max)
- [ ] Cleanup: `ws.close()` called in `useEffect` cleanup function
- [ ] Does not reconnect if component unmounted (checks mounted ref)
- [ ] Sends `{ type: "ping" }` every 30 seconds to keep connection alive

### 3.7 — `frontend/stores/alertStore.ts`
- [ ] Zustand store with `create<AlertStore>()`
- [ ] State: `alerts: AlertResponse[]`, `unreadCount: number`, `isLiveFeedEnabled: boolean`
- [ ] Actions: `addAlert(alert)`, `setAlerts(alerts)`, `markAsRead()`, `toggleLiveFeed()`
- [ ] `addAlert` prepends to array and increments `unreadCount`
- [ ] `addAlert` caps live feed at 100 items (removes oldest)
- [ ] Store persists `isLiveFeedEnabled` to localStorage via `persist` middleware

### 3.8 — `frontend/components/dashboard/AlertFeed.tsx`
- [ ] Subscribes to `alertStore` via Zustand
- [ ] Auto-scrolls to top when new alert arrives
- [ ] Each alert item shows: severity badge, source IP, signature (truncated to 60 chars), timestamp (relative)
- [ ] Relative time uses `date-fns formatDistanceToNow()`
- [ ] CRITICAL alerts have red pulsing left border animation
- [ ] Click on alert → navigate to `/alerts/{id}` or open detail drawer
- [ ] "View All" button links to `/alerts`
- [ ] Empty state component shown when no alerts
- [ ] Loading skeleton shown on initial load

### 3.9 — `frontend/components/alerts/AlertBadge.tsx`
- [ ] Accepts `severity: SeverityLevel` prop
- [ ] Maps each severity to correct Tailwind classes per blueprint Section 7.7
- [ ] CRITICAL badge has `animate-pulse` class
- [ ] Has `role="status"` and `aria-label={severity}` for accessibility
- [ ] Exports `SeverityLevel` type

### 3.10 — `frontend/components/alerts/AlertDetail.tsx`
- [ ] Renders as right-side drawer (Shadcn `Sheet` component)
- [ ] Shows ALL fields: severity, status, signature, SID, src_ip, src_port, dst_ip, dst_port, protocol, flow_id, timestamp, category
- [ ] GeoIP section: country flag emoji + city + org + coordinates
- [ ] `CopyButton` next to src_ip and dst_ip
- [ ] Response history section: lists all automated responses that fired
- [ ] Related alerts section: 3-5 alerts from same source IP
- [ ] Action buttons: Acknowledge, Escalate, Mark False Positive, Block IP
- [ ] Action buttons disabled based on current alert status (e.g., cannot acknowledge already-acknowledged)
- [ ] Notes textarea — editable, auto-saves on blur
- [ ] Raw EVE JSON collapsible section at bottom

### 3.11 — `frontend/components/charts/` (all charts)
- [ ] All charts use Recharts library (not Chart.js)
- [ ] All charts use `ResponsiveContainer` with `width="100%"` and `height={300}` or dynamic height
- [ ] All charts use colors from CSS custom properties: `var(--chart-1)` etc.
- [ ] All charts have `isAnimationActive={true}` with 800ms duration
- [ ] All charts have custom `Tooltip` with dark glassmorphism styling
- [ ] All charts handle empty data state — shows empty state component instead of broken chart
- [ ] `ProtocolPieChart` — `PieChart` with `Pie`, `Cell`, `Legend`, custom label
- [ ] `AlertHistogram` — `BarChart` with 24 bars (one per hour)
- [ ] `SeverityDonut` — `PieChart` with inner radius, shows total in center
- [ ] `TrafficTimeline` — `AreaChart` with gradient fill
- [ ] `AttackCategoryBar` — `BarChart` horizontal layout

### 3.12 — `frontend/components/rules/RuleEditor.tsx`
- [ ] Monaco Editor OR `<textarea>` with monospace font and line numbers (Monaco is preferred)
- [ ] Syntax highlighting for Suricata rule keywords: `alert`, `drop`, `pass`, `reject`, `tcp`, `udp`, `http`, `dns`, `content`, `msg`, `sid`, `rev`, `flow`
- [ ] Real-time validation: `POST /api/v1/rules/validate` called on debounced change (500ms)
- [ ] Validation errors shown inline below editor with line number reference
- [ ] Validation success shown with green checkmark
- [ ] Save button disabled while validation is pending or has errors
- [ ] Keyboard shortcut: `Ctrl+S` / `Cmd+S` to save

### 3.13 — `frontend/components/monitoring/LiveFeed.tsx`
- [ ] WebSocket event stream rendered as virtual scrolling list (prevents DOM bloat)
- [ ] Each event line: `[HH:MM:SS.mmm] [SEVERITY] [PROTOCOL] SRC:PORT → DST:PORT — signature`
- [ ] Color-coded per severity using CSS custom properties
- [ ] New events slide in from top with `framer-motion` animation
- [ ] Max 1000 items in DOM at once (removes oldest when exceeded)
- [ ] Pause button stops DOM updates without closing WebSocket
- [ ] Event counter shows events/second (rolling 1-second average)
- [ ] Auto-scroll disabled when user scrolls up manually (re-enables when scrolled to bottom)

### 3.14 — `frontend/app/(dashboard)/layout.tsx`
- [ ] Renders `Sidebar` + `Header` + `<main>{children}</main>` layout
- [ ] Sidebar state (collapsed/expanded) persisted to localStorage
- [ ] Route changes clear unread count
- [ ] `PageWrapper` used to apply consistent padding and max-width

### 3.15 — `frontend/app/auth/login/page.tsx`
- [ ] Form with username + password fields
- [ ] Client-side validation: both fields required
- [ ] `POST /api/v1/auth/login` called on submit
- [ ] JWT stored appropriately (access token in memory or httpOnly cookie)
- [ ] Redirect to `/dashboard` on success
- [ ] Error message displayed on failed login (invalid credentials)
- [ ] Loading state on submit button
- [ ] Keyboard: pressing Enter submits form
- [ ] No `<form>` element used (as per blueprint Rule 25 — but this applies to artifacts; in actual Next.js a form is fine with `e.preventDefault()`)

### 3.16 — ALL TypeScript files
- [ ] Zero `any` types — every variable and parameter is explicitly typed
- [ ] Zero TypeScript compilation errors: `npx tsc --noEmit` passes
- [ ] Interfaces defined in `frontend/types/` used consistently across components
- [ ] No inline type definitions that duplicate existing interfaces
- [ ] Barrel exports (`index.ts`) used in types/ directory

---

## AUDIT POINT 4 — LAYERED ARCHITECTURE COMPLIANCE

**Check every Python import statement across the entire backend:**

```
ALLOWED import directions (strictly one-way):
  routes/ → services/ ✅
  routes/ → schemas/ ✅
  services/ → repositories/ ✅
  services/ → schemas/ ✅
  services/ → models/ ✅
  repositories/ → models/ ✅
  detection/ → services/ ✅ (to create alerts)
  response/ → schemas/ ✅
  middleware/ → core/ ✅
  All layers → core/ ✅
  All layers → utils/ ✅

FORBIDDEN import directions:
  services/ → routes/ ❌
  repositories/ → services/ ❌
  models/ → repositories/ ❌
  core/ → services/ ❌
  core/ → repositories/ ❌
```

Run this audit programmatically by scanning all `import` statements. Flag any forbidden import and fix it.

---

## AUDIT POINT 5 — DATABASE LAYER AUDIT

### 5.1 — Migration Files
- [ ] At least one migration in `backend/database/migrations/versions/`
- [ ] Migration creates ALL tables from blueprint Section 12: `users`, `alerts`, `network_events`, `detection_rules`, `response_logs`, `traffic_statistics`, `blocked_ips`, `audit_logs`
- [ ] Migration has both `upgrade()` and `downgrade()` functions
- [ ] `downgrade()` drops tables in reverse dependency order (child tables first)
- [ ] Running `alembic upgrade head` on empty database creates all tables
- [ ] Running `alembic downgrade base` drops all tables cleanly

### 5.2 — Seed Script (`backend/database/seed.py`)
- [ ] Creates `admin` user with role `admin`, hashed password `changeme123`
- [ ] Creates `analyst1` user with role `analyst`
- [ ] Creates minimum 50 sample alerts with varied: severity levels, statuses, categories, source IPs (fabricated), timestamps spread over last 7 days
- [ ] Creates minimum 5 sample custom detection rules in `detection_rules` table
- [ ] Script is idempotent — running it twice does not create duplicates
- [ ] Uses SQLAlchemy async session

### 5.3 — Index Verification
- [ ] All indexes from blueprint Section 12.2 defined in migration
- [ ] Composite index `idx_alerts_timestamp_severity` exists
- [ ] Partial index on `alerts.status` for non-RESOLVED records
- [ ] Hash index on `alerts.src_ip` for equality lookups

---

## AUDIT POINT 6 — API COMPLETENESS AUDIT

**Cross-reference every endpoint in Blueprint Section 13 against the implementation:**

### Auth Endpoints
- [ ] `POST /api/v1/auth/login` — returns access_token + refresh_token
- [ ] `POST /api/v1/auth/refresh` — exchanges refresh token for new access token
- [ ] `POST /api/v1/auth/logout` — invalidates refresh token
- [ ] `GET /api/v1/auth/me` — returns current user profile

### Alert Endpoints
- [ ] `GET /api/v1/alerts` — paginated, all filter params working
- [ ] `GET /api/v1/alerts/{id}` — returns full alert with raw_eve and geo data
- [ ] `POST /api/v1/alerts/{id}/acknowledge` — changes status to ACKNOWLEDGED
- [ ] `POST /api/v1/alerts/{id}/resolve` — changes status to RESOLVED or FALSE_POSITIVE
- [ ] `POST /api/v1/alerts/{id}/escalate` — changes status to ESCALATED
- [ ] `DELETE /api/v1/alerts/{id}` — admin only, returns 403 for non-admin
- [ ] `POST /api/v1/alerts/bulk-acknowledge` — bulk status update
- [ ] `GET /api/v1/alerts/export` — returns file download (CSV or JSON)

### Statistics Endpoints
- [ ] `GET /api/v1/statistics/dashboard` — all fields from blueprint present
- [ ] `GET /api/v1/statistics/timeline` — returns bucketed data with `range` and `interval` params
- [ ] `GET /api/v1/statistics/top-attackers` — top N source IPs with country and count
- [ ] `GET /api/v1/statistics/protocols` — protocol distribution with percentage
- [ ] `GET /api/v1/statistics/categories` — category distribution

### Rules Endpoints
- [ ] `GET /api/v1/rules` — filterable, paginated
- [ ] `POST /api/v1/rules` — validates before saving, sends SIGHUP
- [ ] `GET /api/v1/rules/{id}` — includes trigger count and last triggered
- [ ] `PUT /api/v1/rules/{id}` — updates rule, rewrites file, sends SIGHUP
- [ ] `DELETE /api/v1/rules/{id}` — removes from file and DB
- [ ] `POST /api/v1/rules/validate` — validation only, no persist
- [ ] `POST /api/v1/rules/{id}/toggle` — enables/disables without editing content
- [ ] `POST /api/v1/rules/reload` — sends SIGHUP to Suricata

### System Endpoints
- [ ] `GET /api/v1/system/health` — no auth required, returns all component statuses
- [ ] `GET /api/v1/system/suricata/stats` — returns Suricata statistics
- [ ] `POST /api/v1/system/suricata/start` — admin only
- [ ] `POST /api/v1/system/suricata/stop` — admin only
- [ ] `POST /api/v1/system/suricata/restart` — admin only
- [ ] `GET /api/v1/system/blocked-ips` — paginated list
- [ ] `DELETE /api/v1/system/blocked-ips/{ip}` — admin only, removes firewall rule

### API Contract Verification
For EVERY endpoint, verify:
- [ ] Response matches envelope `{ success: bool, data: ..., message: str, meta?: {...} }`
- [ ] Error responses match `{ success: false, error: str, message: str, request_id: str }`
- [ ] HTTP status codes match blueprint Section 13.8

### WebSocket Protocol
- [ ] Connection at `ws://localhost:8000/ws/events?token={jwt}`
- [ ] `new_alert` message format matches blueprint Section 13.7
- [ ] `stats_update` sent every 30 seconds
- [ ] `ping` sent every 30 seconds
- [ ] Server handles `pong` response from client
- [ ] Server handles `subscribe` message with severity filter
- [ ] Invalid/expired token on WS connect → sends `401` close code and closes connection

---

## AUDIT POINT 7 — SECURITY AUDIT

**Run through every security requirement in Blueprint Section 14:**

- [ ] `JWT_SECRET_KEY` has no hardcoded fallback in any file
- [ ] `bcrypt` work factor is `12` (not less)
- [ ] Refresh tokens stored in `httpOnly` cookie (not in localStorage or response body)
- [ ] All 7 security headers applied to every response (from blueprint Section 14.3)
- [ ] CORS `allow_origins` does NOT contain `"*"` in any environment
- [ ] Rate limiter returns `429` with `Retry-After` header
- [ ] No raw SQL strings in any repository (only ORM)
- [ ] IP address validation runs on every `src_ip`/`dst_ip` input
- [ ] Suricata rule content sanitized: no shell metacharacters allowed before writing to disk
- [ ] `bandit -r backend/` produces zero HIGH or CRITICAL findings
- [ ] `pip-audit` produces no known vulnerabilities in installed packages
- [ ] `npm audit` produces no HIGH or CRITICAL vulnerabilities
- [ ] `.env` in `.gitignore` and confirmed not committed anywhere in git history
- [ ] `*.mmdb` GeoIP files in `.gitignore` (too large and proprietary)
- [ ] `logs/` directory in `.gitignore` (contains sensitive network data)
- [ ] No API keys, tokens, or secrets anywhere in committed code (search all files)

**Run this search across ALL files and fix anything found:**
```bash
grep -r "password\|secret\|token\|api_key\|apikey" --include="*.py" --include="*.ts" --include="*.tsx" --include="*.yaml" --include="*.yml" | grep -v ".env.example" | grep -v "test_" | grep -v "# "
```
Any non-comment, non-example hit must be examined and fixed.

---

## AUDIT POINT 8 — TESTING AUDIT

### 8.1 — Backend Tests

**`tests/backend/conftest.py`:**
- [ ] `async_engine` fixture using in-memory SQLite (`:memory:`)
- [ ] `db_session` fixture creates and rolls back transaction after each test
- [ ] `client` fixture creates `AsyncClient` with `LifespanManager` from `asgi-lifespan`
- [ ] `auth_headers` fixture returns `{"Authorization": "Bearer {test_token}"}`
- [ ] `seed_alerts` fixture creates 10 test alerts in the test DB
- [ ] `make_alert_create()` factory function for generating test data
- [ ] All fixtures are `async` with `@pytest.fixture`

**`tests/backend/unit/test_eve_parser.py`:**
- [ ] Tests every EVE event type (alert, dns, http, tls, flow, stats, fileinfo)
- [ ] Tests malformed JSON handling — must NOT raise exception
- [ ] Tests missing fields in EVE event (partial events)
- [ ] Tests IPv6 source/destination addresses
- [ ] Tests timestamp parsing with timezone offset
- [ ] 100% line coverage on `eve_parser.py`

**`tests/backend/unit/test_alert_service.py`:**
- [ ] All repository methods mocked using `unittest.mock.AsyncMock`
- [ ] EventBus mocked and `publish` call verified
- [ ] Deduplication tested: second identical alert within 60s returns `None`
- [ ] Severity classification tested for all 5 levels
- [ ] `acknowledge_alert` fails with `AlertNotFoundError` for unknown ID
- [ ] `acknowledge_alert` fails with `InvalidStateError` if alert already resolved

**`tests/backend/unit/test_rule_validator.py`:**
- [ ] All VALID_RULES from blueprint pass validation
- [ ] All INVALID_RULES from blueprint fail validation
- [ ] Tests with empty string input
- [ ] Tests with None input
- [ ] Tests duplicate SID detection

**`tests/backend/integration/test_alert_api.py`:**
- [ ] Uses real (test) database
- [ ] `GET /alerts` returns seeded alerts
- [ ] `GET /alerts?severity=CRITICAL` filters correctly
- [ ] `GET /alerts?page=2&per_page=5` returns correct page
- [ ] `GET /alerts/{id}` returns 404 for non-existent ID
- [ ] `POST /alerts/{id}/acknowledge` changes status
- [ ] `DELETE /alerts/{id}` returns 403 for analyst, 204 for admin
- [ ] All endpoints return 401 without authentication

**Run test suite and verify:**
```bash
pytest tests/backend/ --cov=backend --cov-report=term-missing
```
- [ ] Coverage report shows ≥ 80% overall
- [ ] Coverage shows ≥ 90% on `services/` directory
- [ ] Zero test failures
- [ ] Zero test errors

### 8.2 — Frontend Tests

**`tests/frontend/test_alert_badge.test.tsx`:**
- [ ] Tests all 5 severity levels render
- [ ] Tests correct CSS classes applied per severity
- [ ] Tests accessibility: `role="status"` and `aria-label` present

**`tests/frontend/test_stat_card.test.tsx`:**
- [ ] Tests card renders title and value
- [ ] Tests positive trend shows green upward arrow
- [ ] Tests negative trend shows red downward arrow
- [ ] Tests loading skeleton renders when `isLoading={true}`

**Run frontend tests:**
```bash
npx jest --coverage
```
- [ ] All tests pass
- [ ] No snapshot mismatches

---

## AUDIT POINT 9 — SURICATA INTEGRATION AUDIT

### 9.1 — `suricata/config/suricata.yaml`
- [ ] `af-packet` section configured with `eth0`, `cluster_flow`, `tpacket-v3: yes`, `use-mmap: yes`
- [ ] `eve-log` output enabled with filename `/var/log/suricata/eve.json`
- [ ] ALL required event types enabled: `alert`, `http`, `dns`, `tls`, `flow`, `stats`, `files`
- [ ] Alert section has `payload: yes` and `packet: yes`
- [ ] Rule files referenced: `emerging-all.rules`, `custom.rules`, `local.rules`
- [ ] Threading configured with `detect-thread-ratio: 1.0`
- [ ] Console logging disabled (only file logging)
- [ ] Suricata log file path: `/var/log/suricata/suricata.log`

### 9.2 — `suricata/rules/custom.rules`
Must contain minimum **10 custom rules** covering these attack categories:
- [ ] Port scan detection (TCP SYN flood to multiple ports)
- [ ] SSH brute force detection (multiple connections to port 22)
- [ ] HTTP directory traversal (`../`)
- [ ] SQL injection keywords in HTTP requests
- [ ] DNS exfiltration (large DNS TXT queries)
- [ ] ICMP flood detection
- [ ] Telnet access attempt
- [ ] FTP login attempt
- [ ] Nmap scan signature
- [ ] Log4Shell/CVE-2021-44228 detection

Each rule must:
- [ ] Have unique SID in range `1000001-1000999`
- [ ] Have `rev:1;` or higher
- [ ] Have descriptive `msg` field
- [ ] Have correct `classtype` keyword

### 9.3 — `suricata/rules/README.md`
- [ ] Explains Suricata rule syntax (action, header, options)
- [ ] Shows example rule for each category in `custom.rules`
- [ ] Explains how to test rules: `suricata -T -c suricata.yaml`
- [ ] Explains SID numbering convention (1000001+)
- [ ] Explains how to reload rules without restart (SIGHUP)

---

## AUDIT POINT 10 — DOCKER & DEPLOYMENT AUDIT

### 10.1 — `docker/Dockerfile.backend`
- [ ] Multi-stage build: `deps` stage and `production` stage
- [ ] Non-root user `nidsuser` created and used
- [ ] `HEALTHCHECK` instruction present
- [ ] `.dockerignore` exists and excludes: `.env`, `venv/`, `__pycache__/`, `*.pyc`, `tests/`, `docs/`
- [ ] No secrets or env vars baked into image

### 10.2 — `docker/Dockerfile.frontend`
- [ ] Three-stage build: `deps`, `builder`, `production`
- [ ] `NEXT_TELEMETRY_DISABLED=1` set
- [ ] `nextjs` user created with UID 1001
- [ ] Standalone Next.js output used (`output: 'standalone'` in `next.config.ts`)
- [ ] `HEALTHCHECK` instruction present

### 10.3 — `docker/Dockerfile.suricata`
- [ ] Based on `ubuntu:22.04`
- [ ] Suricata installed from OISF PPA (not Ubuntu default which may be older)
- [ ] `suricata-update` run to download ET Open rules during build
- [ ] `/var/log/suricata` declared as `VOLUME`

### 10.4 — `docker-compose.yml` (root level)
- [ ] All 4 services defined: suricata, backend, frontend, nginx
- [ ] Suricata uses `network_mode: host` and `privileged: true`
- [ ] `suricata_logs` named volume shared between suricata and backend
- [ ] All services have `restart: unless-stopped`
- [ ] `depends_on` with health check conditions used
- [ ] No hardcoded secrets in compose file (use `env_file`)

### 10.5 — `docker/nginx.conf`
- [ ] Proxies `/api/` to backend at `http://backend:8000/`
- [ ] Proxies `/ws/` to backend with WebSocket upgrade headers: `Upgrade: $http_upgrade`, `Connection: "upgrade"`
- [ ] Proxies `/` to frontend at `http://frontend:3000/`
- [ ] Gzip compression enabled
- [ ] Client max body size: `1m` (matches Uvicorn limit)
- [ ] Proxy timeouts configured (not default 60s — use 300s for large exports)

### 10.6 — One-Command Start Verification
After audit and fixes, verify this works:
```bash
# On clean Ubuntu 22.04 with Docker installed
git clone https://github.com/harisx404/CodeAlpha_NetworkIntrusionDetectionSystem
cd CodeAlpha_NetworkIntrusionDetectionSystem
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
docker-compose up -d
```
- [ ] All 4 containers start without errors
- [ ] `http://localhost:3000` — dashboard loads
- [ ] `http://localhost:8000/docs` — OpenAPI docs load
- [ ] `http://localhost:8000/api/v1/system/health` — returns `{"status": "healthy"}`
- [ ] Login with `admin` / `changeme123` succeeds

---

## AUDIT POINT 11 — GITHUB REPOSITORY AUDIT

### 11.1 — README.md Quality
Read the entire `README.md` and verify:
- [ ] Hero banner image at top (`assets/banner.png`)
- [ ] Project title as `<h1>` centered with shield emoji
- [ ] Project tagline as centered subtitle
- [ ] All badges from blueprint Section 20.5 present (at minimum 8 badges)
- [ ] Screenshots table with 3 images in a 3-column layout
- [ ] Features section with all 9 bullet points from blueprint Section 19.1
- [ ] Architecture section with diagram image
- [ ] Quick Start section: 4 numbered steps (clone, configure, docker-compose up, access)
- [ ] Project Structure: condensed folder tree (not full tree)
- [ ] Detection Rules section with one example rule
- [ ] Documentation table with all 5 docs linked
- [ ] Contributing section linking to CONTRIBUTING.md
- [ ] License section
- [ ] Author section with GitHub and LinkedIn links
- [ ] Acknowledgements section
- [ ] Footer: "Built with ❤️ for CodeAlpha Cybersecurity Internship"
- [ ] No broken image links (all `assets/` images exist)
- [ ] No broken documentation links

### 11.2 — CONTRIBUTING.md Quality
- [ ] Full CONTRIBUTING.md with all 8 sections from blueprint Section 21.1
- [ ] PR checklist has all items from blueprint
- [ ] "Good First Issues" section with 4 examples
- [ ] Contribution types table present

### 11.3 — SECURITY.md
- [ ] States supported versions
- [ ] Explains how to report security vulnerabilities (email, not public issue)
- [ ] Response timeline commitment
- [ ] Disclosure policy (coordinated disclosure)

### 11.4 — CHANGELOG.md
- [ ] Follows [Keep a Changelog](https://keepachangelog.com/) format
- [ ] Has `[Unreleased]` section at top
- [ ] Has `[1.0.0]` release section
- [ ] Release sections categorized: Added, Changed, Fixed, Security
- [ ] Every phase from Phase 0 to Phase 11 has a corresponding entry

### 11.5 — CODE_OF_CONDUCT.md
- [ ] Based on Contributor Covenant v2.1
- [ ] Enforcement section present
- [ ] Contact email for reporting violations

### 11.6 — LICENSE
- [ ] MIT License
- [ ] Year is current (2024 or 2025)
- [ ] Copyright holder is `Muhammad Haris (harisx404)`

### 11.7 — `.github/` Templates
**Issue templates:**
- [ ] `bug_report.md` — all fields from blueprint Section 17.3 present
- [ ] `feature_request.md` — all fields from blueprint Section 17.3 present
- [ ] `rule_suggestion.md` — fields: rule description, attack type, example traffic, example rule

**PR template:**
- [ ] All sections from blueprint Section 21.2 present
- [ ] Type of change checkboxes
- [ ] Testing checklist
- [ ] Screenshots table

**CODEOWNERS:**
- [ ] `* @harisx404` — assigns harisx404 as reviewer for all files
- [ ] `suricata/rules/ @harisx404` — explicit ownership of rules directory

**dependabot.yml:**
```yaml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/backend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 11.8 — GitHub Actions Workflows

**`ci.yml`:**
- [ ] Triggers on `push` and `pull_request` to `main` and `develop`
- [ ] Jobs: lint-backend, test-backend, lint-frontend, test-frontend, build-docker
- [ ] lint-backend: runs `ruff check`, `black --check`, `mypy --strict`
- [ ] test-backend: runs `pytest` with coverage, uploads to Codecov
- [ ] lint-frontend: runs `eslint` and `tsc --noEmit`
- [ ] test-frontend: runs `jest --coverage`
- [ ] build-docker: builds all 3 Docker images to verify no build errors
- [ ] All jobs use correct `runs-on: ubuntu-latest`
- [ ] Python version pinned: `python-version: "3.11"`
- [ ] Node version pinned: `node-version: "20"`

**`release.yml`:**
- [ ] Triggers on `push` with tag matching `v*.*.*`
- [ ] Builds and pushes Docker images to `ghcr.io/harisx404/`
- [ ] Creates GitHub Release with auto-generated release notes
- [ ] Uploads `docker-compose.yml` and `docker-compose.prod.yml` as release assets

**`security-scan.yml`:**
- [ ] Runs CodeQL analysis
- [ ] Triggers on `push`, `pull_request`, and `schedule: cron: "0 0 * * 1"` (weekly)

---

## AUDIT POINT 12 — DOCUMENTATION COMPLETENESS

**Check every file in `docs/`:**

### `docs/ARCHITECTURE.md`
- [ ] Contains the full architecture diagram from blueprint Section 2.1 (ASCII art)
- [ ] Explains all modules and their responsibilities
- [ ] Explains data flow from packet capture to dashboard
- [ ] Technology stack rationale section
- [ ] Links to other documentation

### `docs/INSTALLATION.md`
- [ ] Prerequisites section with exact version numbers
- [ ] Docker Quick Start (3 commands)
- [ ] Manual Installation: Python backend setup (exact commands)
- [ ] Manual Installation: Frontend setup (exact commands)
- [ ] Manual Installation: Suricata setup (exact commands)
- [ ] GeoIP database download instructions (MaxMind registration required)
- [ ] Verification steps after installation
- [ ] Default credentials documented
- [ ] Common Issues section with 5+ troubleshooting entries

### `docs/RULE_GUIDE.md`
- [ ] Suricata rule anatomy explained with annotated example
- [ ] Rule actions: alert, drop, pass, reject — when to use each
- [ ] Protocol keywords: tcp, udp, icmp, http, dns, tls
- [ ] Detection keywords: content, pcre, flow, flags, threshold, reference
- [ ] Custom SID convention: `1000001-1000999`
- [ ] Category classifications used in this project
- [ ] 5+ complete example rules with explanations
- [ ] Testing procedure: `suricata -T -c suricata.yaml -S custom.rules`
- [ ] Reload procedure without restart: `kill -HUP $(pidof suricata)`
- [ ] Performance tips: avoid PCRE where possible, use fast_pattern

### `docs/API.md`
- [ ] Base URL and versioning explained
- [ ] Authentication flow with token example
- [ ] Every endpoint documented (can reference FastAPI `/docs` but must provide examples)
- [ ] WebSocket protocol documented with message format examples
- [ ] Python SDK example: authenticating and fetching alerts
- [ ] JavaScript/TypeScript SDK example: WebSocket connection
- [ ] Rate limiting behavior documented with example 429 response
- [ ] Error code reference table

### `docs/DEPLOYMENT.md`
- [ ] Docker Compose development setup
- [ ] Docker Compose production setup
- [ ] Environment variables reference (all variables in `.env.example`)
- [ ] PostgreSQL production migration guide
- [ ] HTTPS configuration with Let's Encrypt
- [ ] Firewall configuration for production
- [ ] Log management and rotation
- [ ] Backup strategy

### `docs/USER_GUIDE.md`
- [ ] Dashboard navigation explained
- [ ] How to investigate an alert (step by step)
- [ ] How to acknowledge and resolve alerts
- [ ] How to create a custom detection rule
- [ ] How to block an IP address
- [ ] How to configure notifications
- [ ] How to generate reports
- [ ] Screenshots or descriptions of each page

### `docs/FAQ.md`
- [ ] Minimum 20 questions covering common issues
- [ ] Questions organized by category: Installation, Configuration, Detection, Dashboard, API, Contributing
- [ ] Each answer is complete and self-contained

---

## AUDIT POINT 13 — CODING STANDARDS COMPLIANCE

Verify **Blueprint Section 6** across the entire codebase:

### Python Naming
- [ ] All module files use `snake_case`
- [ ] All classes use `PascalCase`
- [ ] All functions use `snake_case`
- [ ] All constants use `UPPER_SNAKE_CASE`
- [ ] No single-letter variable names except loop indices `i`, `j`, `k`
- [ ] No abbreviated names like `mgr`, `svc`, `repo` — use full names

### TypeScript Naming
- [ ] All component files use `PascalCase.tsx`
- [ ] All hook files use `camelCase.ts`
- [ ] All interfaces use `PascalCase`
- [ ] No `any` types anywhere
- [ ] All hooks start with `use` prefix

### Docstrings (Python)
- [ ] Every `class` has a class-level docstring
- [ ] Every `def` and `async def` has a Google-style docstring
- [ ] Complex functions have `Args:`, `Returns:`, `Raises:` sections
- [ ] No one-line methods with no docstring (even trivial getters)

### JSDoc (TypeScript)
- [ ] Every exported function has JSDoc
- [ ] Every custom hook has `@param` and `@returns` documentation
- [ ] Every TypeScript interface has field-level comments

### Error Handling
- [ ] No bare `except:` clauses in Python (always `except SpecificError as e:`)
- [ ] No swallowed exceptions (always log before continuing)
- [ ] No `console.log` in frontend (only `console.error` in catch blocks)

---

## AUDIT POINT 14 — GIT HISTORY & COMMIT QUALITY

**This is a critical portfolio review point. Recruiters look at commit history.**

### Check commit messages:
```bash
git log --oneline
```

Every commit must:
- [ ] Follow Conventional Commits format: `type(scope): description`
- [ ] Be descriptive and specific (not "fix", "update", "stuff")
- [ ] Represent a logical unit of work (not "all features")
- [ ] Be appropriately sized (not one massive commit with everything)

### Expected commit structure by phase:

```
Phase 0 (Repository Setup):
  chore(init): initialize repository structure with folder tree
  chore(github): add issue templates, PR template, and CODEOWNERS
  chore(github): configure dependabot and branch protection docs

Phase 1 (Dev Environment):
  chore(backend): add pyproject.toml with ruff, black, mypy config
  chore(backend): add pinned requirements.txt and requirements-dev.txt
  chore(frontend): initialize Next.js 14 with TypeScript and Tailwind
  chore(frontend): configure tsconfig strict mode and path aliases
  feat(core): add Pydantic Settings configuration with all env vars
  feat(core): add structlog structured logging configuration

Phase 2 (Database):
  feat(models): add TimestampMixin base model and declarative base
  feat(models): add Alert model with all fields and indexes
  feat(models): add User, DetectionRule, NetworkEvent models
  feat(models): add ResponseLog, AuditLog, BlockedIP, Statistics models
  feat(database): initialize Alembic with async SQLAlchemy support
  feat(database): add initial migration creating all 8 tables
  feat(database): add seed script with admin user and sample alerts

Phase 3 (Services):
  feat(repositories): add generic async BaseRepository[T]
  feat(repositories): implement AlertRepository with filter support
  feat(repositories): implement RuleRepository, UserRepository
  feat(schemas): add Pydantic v2 schemas for alerts, rules, auth
  feat(schemas): add PaginatedResponse[T] and ErrorResponse common schemas
  feat(services): implement AlertService with lifecycle management
  feat(services): implement AuthService with JWT creation and validation
  feat(services): implement RuleService with file management

Phase 4 (Detection Engine):
  feat(detection): add EVE JSON parser for all Suricata event types
  feat(detection): add asyncio-based EVE log watcher
  feat(detection): add alert manager with deduplication and classification
  feat(detection): add MaxMind GeoIP2 enricher with LRU cache
  feat(detection): add Suricata rule syntax validator
  feat(detection): add Suricata process manager (start/stop/SIGHUP)
  feat(core): add asyncio EventBus for internal publish/subscribe

Phase 5 (Response Engine):
  feat(response): add abstract BaseResponseHandler
  feat(response): implement LogHandler and EmailHandler
  feat(response): implement WebhookHandler with Slack/Teams support
  feat(response): implement FirewallHandler with RFC1918 whitelist
  feat(response): implement IPBlockHandler with TTL expiry
  feat(response): implement ResponseEngine orchestrator

Phase 6 (API):
  feat(api): add FastAPI application factory with lifespan
  feat(middleware): add CORS, rate limiter, request logger, auth middleware
  feat(api): implement all alert endpoints with pagination and filters
  feat(api): implement statistics endpoints with pre-aggregation
  feat(api): implement rules endpoints with validation and SIGHUP
  feat(api): implement system health and Suricata control endpoints
  feat(api): implement auth endpoints with JWT and refresh tokens
  feat(websocket): add WebSocket manager with broadcast and ping

Phase 7 (Frontend):
  feat(ui): configure Tailwind design system with cybersecurity palette
  feat(ui): add Shadcn UI components (button, card, badge, dialog, table)
  feat(layout): implement dark sidebar navigation with collapse
  feat(layout): implement header with notification bell and user avatar
  feat(dashboard): implement StatCard KPI widget component
  feat(dashboard): implement live AlertFeed with WebSocket integration
  feat(dashboard): implement SeverityDonut and TrafficTimeline charts
  feat(alerts): implement AlertTable with filtering and pagination
  feat(alerts): implement AlertDetail drawer with full metadata
  feat(monitoring): implement live event stream with pause/resume
  feat(rules): implement RuleEditor with syntax validation
  feat(analytics): implement all 7 chart types on analytics page
  feat(auth): implement login page with JWT flow

Phase 8 (Docker):
  feat(docker): add multi-stage Dockerfile for Python backend
  feat(docker): add multi-stage Dockerfile for Next.js frontend
  feat(docker): add Suricata Dockerfile with ET Open rules
  feat(docker): add nginx reverse proxy configuration
  feat(docker): add docker-compose.yml for development stack

Phase 9 (Testing):
  test(detection): add unit tests for EVE parser (100% coverage)
  test(services): add unit tests for AlertService with mocked deps
  test(services): add unit tests for RuleValidator
  test(api): add integration tests for all alert endpoints
  test(api): add integration tests for WebSocket connection
  test(frontend): add component tests for AlertBadge and StatCard

Phase 10 (Documentation):
  docs: add comprehensive README with badges and screenshots
  docs: add INSTALLATION.md with Docker and manual setup guides
  docs: add RULE_GUIDE.md with Suricata rule writing reference
  docs: add API.md with all endpoints and WebSocket protocol
  docs: add ARCHITECTURE.md with system diagram
  docs(contributing): add CONTRIBUTING.md with PR workflow
  docs: add SECURITY.md, CODE_OF_CONDUCT.md, CHANGELOG.md

Phase 11 (Release):
  chore(ci): add GitHub Actions CI workflow
  chore(ci): add release workflow for Docker image publishing
  chore(ci): add security scan workflow with CodeQL
  chore(release): prepare v1.0.0 release
```

**If the commit history does not match this pattern, do NOT rewrite history.** Instead:
- Add a note in the audit report about the commit history quality
- Ensure future commits (for any fixes you make) follow the convention

---

## AUDIT POINT 15 — PERFORMANCE AUDIT

- [ ] `EVELogWatcher.tail()` uses `await asyncio.sleep(0.1)` not `time.sleep(0.1)`
- [ ] `GeoIPEnricher` has `@functools.lru_cache(maxsize=10000)` — verify cache hit rates will be high
- [ ] Dashboard statistics endpoint uses `traffic_statistics` table, NOT live `COUNT(*) GROUP BY` on alerts
- [ ] Background aggregator job runs every 60 seconds and updates `traffic_statistics`
- [ ] Alert listing endpoint does NOT select `raw_eve` column (too large for list views)
- [ ] Alert detail endpoint DOES select `raw_eve` (needed for full detail view)
- [ ] SQLAlchemy async connection pool `pool_size=10, max_overflow=20` configured
- [ ] Next.js dynamic imports used for all chart components
- [ ] WebSocket updates debounced on frontend if rate > 10/second
- [ ] No `SELECT *` queries anywhere in repositories

---

## AUDIT POINT 16 — ACCESSIBILITY AUDIT

- [ ] All interactive elements have `focus-visible` styles (cyan ring visible on keyboard nav)
- [ ] All icon-only buttons have `aria-label` attributes
- [ ] Alert severity badges have `role="status"` and `aria-label={severity}`
- [ ] All form inputs have associated `<label>` elements
- [ ] Color is never the sole differentiator (icons + text accompany all color indicators)
- [ ] Minimum contrast ratio 4.5:1 on all text (verify with browser DevTools)
- [ ] All modals/drawers: `aria-modal="true"`, focus trapped inside, `Escape` closes
- [ ] Images have `alt` attributes
- [ ] Keyboard navigation works through entire dashboard (Tab order logical)

---

## AUDIT POINT 17 — RESPONSIVE DESIGN AUDIT

Test at these viewport widths:
- [ ] **768px** — Mobile: Sidebar hidden, hamburger menu visible, single-column layout
- [ ] **1024px** — Tablet: Sidebar icons-only (60px), 2-column grid
- [ ] **1280px** — Desktop: Full sidebar (240px), multi-column layout
- [ ] **1920px** — Large: Wider charts, maximum data density

For each breakpoint verify:
- [ ] No horizontal scrollbar
- [ ] All text readable (no overflow)
- [ ] Charts resize proportionally
- [ ] Alert table scrolls horizontally gracefully on small screens
- [ ] Sidebar collapse/expand works on all sizes

---

## AUDIT POINT 18 — `.env.example` COMPLETENESS

Verify `backend/.env.example` contains ALL variables from blueprint Section 14.4:

```env
# Verify these are all present with descriptions and safe placeholder values:
APP_NAME=NIDS-Pro
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000
DEBUG=false
JWT_SECRET_KEY=CHANGE_THIS_TO_A_256_BIT_RANDOM_KEY
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL=sqlite+aiosqlite:///./database/nids.db
SURICATA_LOG_PATH=/var/log/suricata/eve.json
SURICATA_CONFIG_PATH=/etc/suricata/suricata.yaml
SURICATA_RULES_PATH=/etc/suricata/rules/custom.rules
GEOIP_DB_PATH=/opt/geoip/GeoLite2-City.mmdb
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
ENABLE_LOG_RESPONSE=true
ENABLE_EMAIL_RESPONSE=false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
ALERT_EMAIL_TO=
ENABLE_WEBHOOK_RESPONSE=false
WEBHOOK_URL=
WEBHOOK_MIN_SEVERITY=MEDIUM
ENABLE_FIREWALL_RESPONSE=false
ENABLE_IP_BLOCK_RESPONSE=false
IP_BLOCK_THRESHOLD_COUNT=5
IP_BLOCK_THRESHOLD_MINUTES=5
IP_BLOCK_DURATION_HOURS=24
```

Each variable must have a comment explaining its purpose.

---

## AUDIT POINT 19 — SCRIPTS AUDIT

### `scripts/setup.sh`
- [ ] Shebang line: `#!/bin/bash`
- [ ] `set -euo pipefail` at top
- [ ] Checks prerequisites: Python 3.11+, Node 20+, Docker
- [ ] Creates `.env` from `.env.example` if not exists
- [ ] Creates Python virtualenv
- [ ] Installs Python and npm dependencies
- [ ] Runs database migrations
- [ ] Seeds database
- [ ] Prints success message with access URLs
- [ ] Colored output (green for success, red for errors)

### `scripts/generate_traffic.py`
- [ ] Uses `scapy` to generate realistic network traffic for testing
- [ ] Generates: TCP SYN scans, HTTP requests with SQL injection payloads, DNS queries, ICMP packets
- [ ] Sends traffic to loopback or specified interface
- [ ] Can run for specified duration: `python generate_traffic.py --duration 60 --interface eth0`
- [ ] Used to trigger Suricata alerts for demo purposes

### `scripts/seed_db.py`
- [ ] Separate from `backend/database/seed.py` — this is a standalone script callable from CLI
- [ ] Accepts `--count` argument for number of alerts to generate
- [ ] Imports backend models and uses SQLAlchemy
- [ ] Progress bar showing insertion progress

---

## AUDIT POINT 20 — SURICATA CUSTOM RULES QUALITY

Read every rule in `suricata/rules/custom.rules` and verify each one:

- [ ] Syntactically correct (passes `suricata -T`)
- [ ] SID in range 1000001–1000999
- [ ] Has `rev:1;` or higher
- [ ] Has `classtype:` keyword with valid classtype
- [ ] Has `metadata:` with `created_at <date>` and `author harisx404`
- [ ] `msg` field is descriptive and professional
- [ ] Detection logic actually detects the intended attack pattern (not a no-op)
- [ ] Rules are commented with explanation: `# Detects: SSH brute force via rapid connection attempts to port 22`
- [ ] Rules have `flow:` direction keyword where applicable
- [ ] Rules have `threshold:` keyword for noisy rules to prevent alert flooding

---

## AUDIT POINT 21 — FINAL INTEGRATION TEST

After ALL fixes are applied, perform this end-to-end functional test:

**Step 1: Start the stack**
```bash
docker-compose up -d
sleep 30  # wait for all services to be healthy
```

**Step 2: Verify health**
```bash
curl http://localhost:8000/api/v1/system/health
# Expected: {"status": "healthy", "components": {"suricata": {"status": "running"}, ...}}
```

**Step 3: Login and get token**
```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "changeme123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])")
echo "Token obtained: ${TOKEN:0:20}..."
```

**Step 4: Generate test traffic**
```bash
python3 scripts/generate_traffic.py --duration 30 --interface lo
```

**Step 5: Verify alerts are created**
```bash
sleep 5
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/v1/alerts | python3 -m json.tool
# Expected: at least 1 alert in the response
```

**Step 6: Verify dashboard**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200
```

**Step 7: Verify WebSocket**
```python
import asyncio
import websockets
import json

async def test():
    uri = f"ws://localhost:8000/ws/events?token={TOKEN}"
    async with websockets.connect(uri) as ws:
        msg = await asyncio.wait_for(ws.recv(), timeout=35)
        data = json.loads(msg)
        assert data["type"] in ["new_alert", "stats_update", "ping"]
        print(f"WebSocket working: received {data['type']}")

asyncio.run(test())
```

**Step 8: Verify CI would pass**
```bash
cd backend && ruff check . && black --check . && mypy . --strict
cd ../frontend && npx tsc --noEmit && npx eslint .
cd ../tests && pytest backend/ --cov=../backend --cov-report=term
```

---

## AUDIT POINT 22 — PROFESSIONAL POLISH CHECK

**Things that make the difference between a student project and a professional one:**

- [ ] **Consistent emoji usage** — The README uses emojis but the documentation doesn't overuse them
- [ ] **No typos** — Run spell check on ALL markdown files
- [ ] **Version numbers consistent** — README badges show same versions as requirements.txt
- [ ] **Example IPs are RFC5737 safe** — Use `192.0.2.x`, `198.51.100.x`, `203.0.113.x` for documentation examples (not real IPs)
- [ ] **Fake data is realistic** — Sample alert signatures look like real Suricata rules, not "TEST ALERT"
- [ ] **No TODO comments in committed code** — Search for `TODO`, `FIXME`, `HACK`, `XXX` and fix or remove
- [ ] **No debugging artifacts** — No `print()`, `console.log()`, commented-out code blocks
- [ ] **No empty catch blocks** — Every `except` block logs the error
- [ ] **No magic numbers** — All numeric constants are named: `MAX_DEDUPE_WINDOW_SECONDS = 60`
- [ ] **Consistent date format** — All dates are ISO 8601 (`2024-01-15T14:23:11Z`) throughout
- [ ] **Ports not hardcoded** — Ports come from config or environment variables
- [ ] **Log messages are past tense** — `"alert_created"` not `"creating_alert"`
- [ ] **HTTP methods in comments** — `# GET /api/v1/alerts` in route docstrings

---

## AUDIT POINT 23 — PRE-SUBMISSION CHECKLIST

**This is the final gate before submission:**

```
Repository Quality
  [ ] Repository is PUBLIC on GitHub
  [ ] Repository name: CodeAlpha_NetworkIntrusionDetectionSystem
  [ ] All 20 topics from blueprint Section 20.6 set
  [ ] Social preview image uploaded (1280×640)
  [ ] Repository description set (one-line project description)
  [ ] Website field set (if deployment URL available)
  [ ] Repository pinned on harisx404 GitHub profile

Code Quality
  [ ] Zero linting errors (ruff, eslint)
  [ ] Zero type errors (mypy, tsc)
  [ ] Zero security audit findings (bandit HIGH/CRITICAL, npm audit HIGH/CRITICAL)
  [ ] Test suite passes (pytest, jest)
  [ ] Code coverage ≥ 80% backend

Functionality
  [ ] Docker Compose stack starts cleanly
  [ ] Dashboard accessible at localhost:3000
  [ ] Login works with admin/changeme123
  [ ] Live alert feed shows real-time updates
  [ ] Analytics charts render with data
  [ ] Rule management CRUD works
  [ ] System status page shows Suricata as running

Documentation
  [ ] README renders perfectly on GitHub (check in browser)
  [ ] All images in README load correctly
  [ ] All links in README work
  [ ] docs/ folder has all 7 documentation files
  [ ] CHANGELOG.md has v1.0.0 entry

GitHub
  [ ] CI workflow passes (green checkmark on main branch)
  [ ] At least one GitHub Release created (v1.0.0)
  [ ] Issues are enabled
  [ ] Discussions are enabled
  [ ] Branch protection on main
  [ ] CODEOWNERS file present
```

---

## AUDIT POINT 24 — FIX PROTOCOL

When you identify an issue during any audit point, follow this protocol:

**FORMAT FOR EACH FIX:**

```
### FIX #[NUMBER]: [Short Description]
**File:** `path/to/file.py` (line [N]-[M])
**Issue:** [Exact description of the problem]
**Root Cause:** [Why this is wrong]
**Fix:**
```[language]
[Complete corrected code]
```
**Verification:** [How to confirm the fix is correct]
```

Do not provide partial fixes. Every fix must be complete, working code that can be directly placed into the file.

---

## AUDIT POINT 25 — FINAL SIGN-OFF

After completing all 24 audit points and applying all fixes, produce a final sign-off report:

```
====================================================================
                    NIDS PROJECT AUDIT REPORT
                    Final Pre-Submission Review
====================================================================

AUDITOR: [AI Agent ID]
DATE: [Current Date]
PROJECT: CodeAlpha_NetworkIntrusionDetectionSystem
DEVELOPER: Muhammad Haris (@harisx404)

====================================================================
AUDIT SUMMARY
====================================================================

  Total Files Reviewed:        [N]
  Total Issues Found:          [N]
  Total Issues Fixed:          [N]
  Issues Requiring Manual Action: [N]

====================================================================
AUDIT RESULTS BY POINT
====================================================================

  ✅ PASS  AP1:  Folder Structure Compliance
  ✅ PASS  AP2:  Backend Code Quality
  ✅ PASS  AP3:  Frontend Code Quality
  ✅ PASS  AP4:  Layered Architecture Compliance
  ✅ PASS  AP5:  Database Layer
  ✅ PASS  AP6:  API Completeness
  ✅ PASS  AP7:  Security Audit
  ✅ PASS  AP8:  Testing Audit
  ✅ PASS  AP9:  Suricata Integration
  ✅ PASS  AP10: Docker & Deployment
  ✅ PASS  AP11: GitHub Repository
  ✅ PASS  AP12: Documentation
  ✅ PASS  AP13: Coding Standards
  ✅ PASS  AP14: Git History Quality
  ✅ PASS  AP15: Performance
  ✅ PASS  AP16: Accessibility
  ✅ PASS  AP17: Responsive Design
  ✅ PASS  AP18: Environment Configuration
  ✅ PASS  AP19: Scripts
  ✅ PASS  AP20: Suricata Rules
  ✅ PASS  AP21: Integration Test
  ✅ PASS  AP22: Professional Polish
  ✅ PASS  AP23: Pre-Submission Checklist
  ✅ PASS  AP24: All Fixes Applied

====================================================================
BLUEPRINT COMPLIANCE SCORE
====================================================================

  Section 1  Project Overview:          ✅ Complete
  Section 2  System Architecture:       ✅ Complete
  Section 3  Tech Stack:                ✅ Complete
  Section 4  Software Architecture:     ✅ Complete
  Section 5  Folder Structure:          ✅ Complete
  Section 6  Coding Standards:          ✅ Complete
  Section 7  UI/UX Design System:       ✅ Complete
  Section 8  Dashboard Pages:           ✅ Complete
  Section 9  Features:                  ✅ Complete (Mandatory + Advanced)
  Section 10 Alert System:              ✅ Complete
  Section 11 Response Mechanism:        ✅ Complete
  Section 12 Database Design:           ✅ Complete
  Section 13 API Design:                ✅ Complete
  Section 14 Security Practices:        ✅ Complete
  Section 15 Logging Strategy:          ✅ Complete
  Section 16 Testing Strategy:          ✅ Complete
  Section 17 GitHub Standards:          ✅ Complete
  Section 18 Documentation Plan:        ✅ Complete
  Section 19 README Blueprint:          ✅ Complete
  Section 20 GitHub Presentation:       ✅ Complete
  Section 21 Contributor Experience:    ✅ Complete
  Section 22 Deployment:                ✅ Complete
  Section 23 Performance:               ✅ Complete
  Section 24 Future Roadmap:            ✅ Complete (documented)
  Section 25 Development Plan Phases:   ✅ All 12 Phases Complete
  Section 26 Agent Rules (1-28):        ✅ All Rules Followed

  BLUEPRINT COMPLIANCE: 26/26 Sections Complete ✅

====================================================================
AGENT RULES COMPLIANCE
====================================================================

  Rule 1  Blueprint adherence:          ✅
  Rule 2  Folder structure:             ✅
  Rule 3  No hardcoded secrets:         ✅
  Rule 4  Layered architecture:         ✅
  Rule 5  Documentation:                ✅
  Rule 6  Every feature tested:         ✅
  Rule 7  No duplicate code:            ✅
  Rule 8  Async consistency:            ✅
  Rule 9  TypeScript strict mode:       ✅
  Rule 10 Commit conventions:           ✅
  Rule 11 Security first:               ✅
  Rule 12 Error handling:               ✅
  Rule 13 Environment-aware config:     ✅
  Rule 14 Alembic migrations only:      ✅
  Rule 15 Component reusability:        ✅
  Rule 16 API contract:                 ✅
  Rule 17 No console.log:               ✅
  Rule 18 Suricata config-driven:       ✅
  Rule 19 WebSocket disconnection:      ✅
  Rule 20 Runs from clean clone:        ✅
  Rule 21 No sensitive commits:         ✅
  Rule 22 Pagination on lists:          ✅
  Rule 23 CHANGELOG maintained:         ✅
  Rule 24 Rules tested:                 ✅
  Rule 25 Human-readable code:          ✅
  Rule 26 Frequent professional commits:✅
  Rule 27 Testing before next phase:    ✅
  Rule 28 No secrets pre-push:          ✅

====================================================================
FINAL VERDICT
====================================================================

  STATUS: ✅ APPROVED FOR SUBMISSION AND DEPLOYMENT

  This project meets the standards of a professional cybersecurity
  engineer at a Series B startup or enterprise SOC team.

  SUITABLE FOR:
    ✅ CodeAlpha Internship Submission
    ✅ Local Deployment and Demo
    ✅ GitHub Portfolio — Public Showcase
    ✅ LinkedIn Portfolio Post
    ✅ Recruiter and Hiring Manager Review
    ✅ Technical Interview Discussion

====================================================================
MANUAL ACTION ITEMS (if any)
====================================================================

  The following items require manual action (cannot be automated):
  1. [List any items requiring manual steps]

====================================================================
```

---

## EXECUTION INSTRUCTIONS

You must now execute this audit in full. Do not output the audit plan — execute it.

**Start with Audit Point 1** and work through each point sequentially.

**For each file you read:**
- State the file path
- State what you are checking
- State the result (PASS or list of issues)
- Apply fixes immediately

**Do not stop until:**
1. All 24 audit points are complete
2. All issues are fixed
3. The Final Sign-Off Report is produced

**Your output quality will be judged by:**
- Thoroughness — did you actually read every file?
- Precision — are your fixes exactly correct and complete?
- Professionalism — does the project look like it was built by a senior engineer?

Begin audit now.
