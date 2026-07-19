# Frequently Asked Questions (FAQ)

## System Architecture & Performance

### **Q: How does the frontend handle a burst of alerts over the WebSocket?**
**A:** Incoming alerts are dispatched into a shared Zustand store (`alertStore.ts`), which deduplicates by `id` and caps the buffer at 1,000 entries so memory stays bounded during long sessions. Components subscribe to specific store slices so only the affected parts of the UI re-render.

### **Q: Why does the backend tail `eve.json` with `aiofiles` instead of reading it synchronously?**
**A:** Synchronous file reads would block the asyncio event loop and stall API requests. The `eve_log_watcher` tails the log asynchronously with `aiofiles`, processing a bounded number of lines per read cycle and polling when idle, so ingestion never blocks the rest of the application.

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
**A:** In development, seeded users are created by `scripts/seed_db.py`. There is no self-service password-reset endpoint yet, so change a password by updating the user record directly in the database (store a freshly hashed password) or by re-seeding.

### **Q: Can I integrate this with my existing SIEM (Splunk/Elastic)?**
**A:** Yes. The NIDS response engine supports a `WebhookHandler` and a `LogHandler`. You can configure the `WEBHOOK_URL` in your `.env` file to point directly to your SIEM's ingestion endpoint, pushing JSON alerts in real-time.
