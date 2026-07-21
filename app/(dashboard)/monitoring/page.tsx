'use client';

/**
 * System Monitoring — live health and traffic metrics for the NIDS pipeline.
 *
 * Wired to the existing /statistics/current and /system/health endpoints and
 * polled on a short interval so the numbers stay current without a WebSocket.
 */
import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';

interface TrafficStats {
  id: number;
  timestamp: string;
  alerts_total: number;
  alerts_critical: number;
  alerts_high: number;
  bytes_in: number;
  bytes_out: number;
  packets_in: number;
  packets_out: number;
}

const REFRESH_MS = 10_000;

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** exp).toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="glass-panel rounded-lg border border-outline-variant/30 p-6">
      <p className="font-label-caps text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-headline-md text-[28px] font-bold tracking-tight text-on-surface">
        {value}
      </p>
      {hint && <p className="mt-1 font-code-sm text-[11px] text-on-surface-variant">{hint}</p>}
    </div>
  );
}

export default function MonitoringPage() {
  const [stats, setStats] = useState<TrafficStats | null>(null);
  const [healthy, setHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const [statsRes, healthRes] = await Promise.allSettled([
        api.get<ApiResponse<TrafficStats>>('/statistics/current'),
        api.get<{ status: string }>('/system/health'),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data.data);
      }
      setHealthy(
        healthRes.status === 'fulfilled' && healthRes.value.data.status === 'ok'
      );
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Failed to fetch monitoring metrics', e);
      setHealthy(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-[24px] font-bold tracking-tight text-on-surface">
            System Monitoring
          </h1>
          <p className="font-body-md text-[14px] text-on-surface-variant">
            Live health and traffic metrics for NIDS components.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 rounded border border-outline-variant/30 bg-surface-container px-3 py-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                healthy === null
                  ? 'bg-on-surface-variant'
                  : healthy
                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                    : 'bg-secondary-container shadow-[0_0_8px_rgba(255,80,110,0.6)]'
              }`}
            />
            <span className="font-label-caps text-[11px] font-bold uppercase tracking-widest text-on-surface">
              {healthy === null ? 'Checking' : healthy ? 'Engine Online' : 'Engine Unreachable'}
            </span>
          </div>
          {lastUpdated && (
            <span className="font-code-sm text-[11px] text-on-surface-variant">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {loading && !stats ? (
        <div className="glass-panel rounded-lg border border-outline-variant/30 p-8 text-center text-on-surface-variant">
          Loading live metrics...
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-3 font-label-caps text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Traffic Throughput
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Packets In" value={formatNumber(stats?.packets_in ?? 0)} />
              <MetricCard label="Packets Out" value={formatNumber(stats?.packets_out ?? 0)} />
              <MetricCard label="Bytes In" value={formatBytes(stats?.bytes_in ?? 0)} />
              <MetricCard label="Bytes Out" value={formatBytes(stats?.bytes_out ?? 0)} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-label-caps text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Alert Volume
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard label="Total Alerts" value={formatNumber(stats?.alerts_total ?? 0)} />
              <MetricCard
                label="Critical"
                value={formatNumber(stats?.alerts_critical ?? 0)}
                hint="Highest-priority detections"
              />
              <MetricCard
                label="High"
                value={formatNumber(stats?.alerts_high ?? 0)}
                hint="Elevated-priority detections"
              />
            </div>
          </section>

          <p className="font-code-sm text-[11px] text-on-surface-variant">
            Metrics refresh automatically every {REFRESH_MS / 1000} seconds from the latest
            statistics snapshot.
          </p>
        </>
      )}
    </div>
  );
}
