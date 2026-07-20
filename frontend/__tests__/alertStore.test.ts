/**
 * Unit tests for the Zustand alert store that backs the live alert feed.
 * Verifies dedup-by-id, prepend-on-arrival, and the buffer cap.
 */
import { useAlertStore } from "@/stores/alertStore";
import type { AlertResponse } from "@/types/alert";

function makeAlert(id: number, overrides: Partial<AlertResponse> = {}): AlertResponse {
  return {
    id,
    timestamp: "2024-01-15T14:23:11+00:00",
    severity: "HIGH",
    status: "NEW",
    category: "EXPLOIT",
    signature_id: 2030450,
    signature: `Signature ${id}`,
    src_ip: "203.0.113.100",
    src_port: 49152,
    dst_ip: "192.0.2.50",
    dst_port: 8080,
    protocol: "TCP",
    flow_id: "1847291847382",
    geo: null,
    notes: "",
    acknowledged_by: null,
    acknowledged_at: null,
    created_at: "2024-01-15T14:23:11+00:00",
    updated_at: "2024-01-15T14:23:11+00:00",
    ...overrides,
  };
}

beforeEach(() => {
  useAlertStore.getState().clearAlerts();
});

describe("alertStore", () => {
  it("setAlerts replaces the feed and de-duplicates by id", () => {
    useAlertStore.getState().setAlerts([makeAlert(1), makeAlert(1), makeAlert(2)]);
    const { alerts } = useAlertStore.getState();
    expect(alerts.map((a) => a.id)).toEqual([1, 2]);
  });

  it("addAlerts prepends new alerts to the front of the feed", () => {
    useAlertStore.getState().setAlerts([makeAlert(1)]);
    useAlertStore.getState().addAlerts([makeAlert(2)]);
    expect(useAlertStore.getState().alerts.map((a) => a.id)).toEqual([2, 1]);
  });

  it("addAlerts drops duplicates already present in the feed", () => {
    useAlertStore.getState().setAlerts([makeAlert(1), makeAlert(2)]);
    useAlertStore.getState().addAlerts([makeAlert(2), makeAlert(3)]);
    // New alerts are prepended, then dedup keeps the first occurrence of each
    // id: [2, 3] + [1, 2] → [2, 3, 1, 2] → [2, 3, 1].
    expect(useAlertStore.getState().alerts.map((a) => a.id)).toEqual([2, 3, 1]);
  });


  it("caps the buffer to avoid unbounded memory growth", () => {
    const many = Array.from({ length: 1100 }, (_, i) => makeAlert(i));
    useAlertStore.getState().setAlerts(many);
    expect(useAlertStore.getState().alerts.length).toBe(1000);
  });

  it("clearAlerts empties the feed", () => {
    useAlertStore.getState().setAlerts([makeAlert(1)]);
    useAlertStore.getState().clearAlerts();
    expect(useAlertStore.getState().alerts).toEqual([]);
  });
});
