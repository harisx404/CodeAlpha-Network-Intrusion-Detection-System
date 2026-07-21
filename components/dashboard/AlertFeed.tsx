'use client';

import { useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useAlertStore } from '@/stores/alertStore';
import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/api';
import type { AlertResponse } from '@/types/alert';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { format } from 'date-fns';

export function AlertFeed() {
  const alerts = useAlertStore((state) => state.alerts);
  const setAlerts = useAlertStore((state) => state.setAlerts);
  const displayAlerts = alerts.slice(0, 50);

  // Seed the feed with the most recent alerts so it is populated on load;
  // the websocket then prepends live alerts on top of this baseline.
  useEffect(() => {
    let cancelled = false;
    const seedFeed = async () => {
      try {
        const res = await api.get<PaginatedResponse<AlertResponse>>(
          '/alerts?page=1&per_page=50'
        );
        if (!cancelled && res.data.data) {
          setAlerts(res.data.data);
        }
      } catch {
        // Non-fatal: the feed will still fill from the live websocket stream.
      }
    };
    seedFeed();
    return () => {
      cancelled = true;
    };
  }, [setAlerts]);

  return (
    <div className="glass-panel rounded-lg overflow-hidden flex flex-col h-full border border-outline-variant/30">
      <div className="p-panel-padding border-b border-outline-variant/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary-fixed-dim" strokeWidth={2} />
          <h2 className="font-headline-sm text-[18px] font-semibold">Live Alert Feed</h2>
        </div>
        <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-primary-fixed-dim shadow-[0_0_8px_rgba(0,219,231,0.6)] animate-pulse"></span>
          Streaming
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {displayAlerts.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm text-on-surface-variant px-4 text-center">No recent alerts detected. Listening for traffic...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container font-label-caps text-[11px] text-on-surface-variant z-10 shadow-sm">
              <tr>
                <th className="p-4 border-b border-outline-variant/20">Timestamp</th>
                <th className="p-4 border-b border-outline-variant/20">Signature</th>
                <th className="p-4 border-b border-outline-variant/20">Severity</th>
                <th className="p-4 border-b border-outline-variant/20">Source IP</th>
              </tr>
            </thead>
            <tbody className="font-code-sm text-[12px] divide-y divide-outline-variant/10">
              {displayAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-on-surface-variant group-hover:text-on-surface">
                    {alert.timestamp ? format(new Date(alert.timestamp), 'HH:mm:ss') : 'N/A'}
                  </td>
                  <td className="p-4 text-on-surface font-medium truncate max-w-[200px]">{alert.signature}</td>
                  <td className="p-4">
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td className="p-4 text-on-surface-variant">{alert.src_ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
