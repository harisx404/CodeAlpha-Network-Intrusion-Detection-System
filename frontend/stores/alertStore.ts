import { create } from 'zustand';
import type { AlertResponse } from '@/types/alert';

interface AlertStore {
  alerts: AlertResponse[];
  /** Prepend live alerts arriving over the websocket. */
  addAlerts: (newAlerts: AlertResponse[]) => void;
  /** Replace the feed with an initial page fetched over REST. */
  setAlerts: (alerts: AlertResponse[]) => void;
  clearAlerts: () => void;
}

const MAX_ALERTS = 1000;

/** Deduplicate by id, preserving order (first occurrence wins). */
const dedupeById = (alerts: AlertResponse[]): AlertResponse[] => {
  const seen = new Set<number>();
  const result: AlertResponse[] = [];
  for (const alert of alerts) {
    if (seen.has(alert.id)) continue;
    seen.add(alert.id);
    result.push(alert);
  }
  return result;
};

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlerts: (newAlerts) =>
    set((state) => ({
      // Prepend new alerts, drop duplicates, and cap the buffer to avoid leaks.
      alerts: dedupeById([...newAlerts, ...state.alerts]).slice(0, MAX_ALERTS),
    })),
  setAlerts: (alerts) => set({ alerts: dedupeById(alerts).slice(0, MAX_ALERTS) }),
  clearAlerts: () => set({ alerts: [] }),
}));
