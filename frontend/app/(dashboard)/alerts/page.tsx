'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import type { PaginatedResponse } from '@/types/api';
import type { AlertResponse } from '@/types/alert';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get<PaginatedResponse<AlertResponse>>(
          '/alerts?page=1&per_page=50'
        );
        setAlerts(res.data.data ?? []);
      } catch (e) {
        console.error('Failed to fetch alerts', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="font-headline-md text-[24px] font-bold text-on-surface tracking-tight">
          Alert Center
        </h1>
        <p className="font-body-md text-[14px] text-on-surface-variant">
          Investigate and respond to detected threats.
        </p>
      </div>

      <div className="glass-panel flex flex-col overflow-hidden rounded-lg border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
              <tr>
                <th className="px-6 py-3 border-b border-outline-variant/20">Timestamp</th>
                <th className="px-6 py-3 border-b border-outline-variant/20">Severity</th>
                <th className="px-6 py-3 border-b border-outline-variant/20">Signature</th>
                <th className="px-6 py-3 border-b border-outline-variant/20">Source</th>
                <th className="px-6 py-3 border-b border-outline-variant/20">Destination</th>
                <th className="px-6 py-3 border-b border-outline-variant/20">Protocol</th>
              </tr>
            </thead>
            <tbody className="font-code-sm text-[12px] divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                    Loading alerts...
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                    No alerts found matching your criteria.
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-on-surface-variant">
                      {format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td
                      className="max-w-xs truncate px-6 py-4 font-medium text-on-surface"
                      title={alert.signature}
                    >
                      {alert.signature}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{alert.src_ip}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{alert.dst_ip}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{alert.protocol ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
