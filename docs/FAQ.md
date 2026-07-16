# Frequently Asked Questions (FAQ)

## System Architecture & Performance

### **Q: Will the Next.js frontend crash if there is a massive DDoS attack generating 10,000 alerts per second?**
**A:** No. The frontend utilizes a specialized debouncing hook (`useWebSocket.ts`) and Zustand state management. Regardless of how many alerts are received over the WebSocket, React will only re-render the DOM a maximum of 10 times per second, deeply merging the new alerts in the background.

### **Q: Why does the backend use `aiofiles` and `asyncio.Queue` instead of directly writing to PostgreSQL?**
**A:** Traditional synchronous database writes during a network flood will rapidly exhaust the connection pool, causing the API to lock up and drop requests. By buffering the `eve.json` log into an `asyncio.Queue` and using an asynchronous worker to batch-insert records, the system maintains ultra-low latency and absolute stability under heavy load.

### **Q: Does Suricata run in promiscuous mode?**
**A:** Yes. The Suricata container is launched with `network_mode: "host"` and `privileged: true` to allow it to bind to the host's raw sockets and sniff all traffic passing through the interface, not just traffic destined for the Docker bridge.

---

## Operations & Troubleshooting

### **Q: I generated traffic using the script, but no alerts are showing up. Why?**
**A:** 
1. Verify the traffic generator is targeting the correct interface. By default, it targets `lo` or `eth0`.
2. Ensure Suricata successfully loaded the `custom.rules`. Check `docker-compose logs suricata` for syntax errors.
3. Verify the frontend is connected to the WebSocket. A red "Disconnected" badge means the API container might be down.

### **Q: How do I change the default admin password?**
**A:** In the development environment, seeded users are generated via `scripts/seed_db.py`. For production, use the FastAPI interactive docs (`http://localhost:8000/docs`) to hit the `/api/v1/auth/reset` endpoint, or execute a direct SQL query against the database.

### **Q: Can I integrate this with my existing SIEM (Splunk/Elastic)?**
**A:** Yes. The NIDS response engine supports a `WebhookHandler` and a `LogHandler`. You can configure the `WEBHOOK_URL` in your `.env` file to point directly to your SIEM's ingestion endpoint, pushing JSON alerts in real-time.
