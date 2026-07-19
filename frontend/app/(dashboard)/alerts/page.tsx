'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { AlertBadge } from '@/components/ui/AlertBadge';
import { format } from 'date-fns';
import type { PaginatedResponse } from '@/types/api';

type Alert = {
  id: number;
  timestamp: string;
  signature: string;
  severity: string;
  src_ip: string;
  dst_ip: string;
  protocol: string;
  category: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get<PaginatedResponse<Alert>>(
          '/alerts?page=1&per_page=50'
        );
        setAlerts(res.data.data ?? []);
      } catch (e) {
        console.error("Failed to fetch alerts", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  return (
      <div className="flex flex-col space-y-6 h-full">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Alert Center</h2>
            <p className="text-muted-foreground">Investigate and respond to detected threats.</p>
          </div>
        </div>

        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Severity</th>
                  <th className="px-6 py-3">Signature</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Protocol</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Loading alerts...
                    </td>
                  </tr>
                ) : alerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No alerts found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4">
                        <AlertBadge severity={alert.severity} />
                      </td>
                      <td className="px-6 py-4 font-medium max-w-xs truncate" title={alert.signature}>
                        {alert.signature}
                      </td>
                      <td className="px-6 py-4">{alert.src_ip}</td>
                      <td className="px-6 py-4">{alert.dst_ip}</td>
                      <td className="px-6 py-4">{alert.protocol}</td>
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
