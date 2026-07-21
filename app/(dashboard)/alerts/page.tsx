'use client';

/**
 * Alert Center — paginated, filterable table of all security alerts.
 *
 * Features:
 * - Severity / Status / Source IP filter bar
 * - Pagination controls wired to the /alerts API
 * - Click any row to open AlertDetail drawer with Acknowledge / Resolve actions
 */
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/api';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { AlertDetail } from '@/components/alerts/AlertDetail';
import type { PaginatedResponse } from '@/types/api';
import type { AlertResponse, SeverityLevel, AlertStatus } from '@/types/alert';

const SEVERITY_OPTIONS: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const STATUS_OPTIONS: AlertStatus[] = ['NEW', 'ACKNOWLEDGED', 'RESOLVED', 'FALSE_POSITIVE'];
const PER_PAGE = 20;

interface Filters {
  severity: string;
  status: string;
  src_ip: string;
}

const EMPTY_FILTERS: Filters = { severity: '', status: '', src_ip: '' };

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: 'bg-primary-fixed-dim/15 text-primary-fixed-dim',
    ACKNOWLEDGED: 'bg-amber-500/15 text-amber-400',
    RESOLVED: 'bg-green-500/15 text-green-400',
    FALSE_POSITIVE: 'bg-on-surface-variant/20 text-on-surface-variant',
    ESCALATED: 'bg-secondary-container/20 text-secondary-container',
  };
  return (
    <span
      className={`rounded px-2 py-0.5 font-label-caps text-[10px] font-bold uppercase tracking-wide ${
        styles[status] ?? 'bg-surface-variant text-on-surface-variant'
      }`}
    >
      {status}
    </span>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState<AlertResponse | null>(null);

  const fetchAlerts = useCallback(async (currentPage: number, currentFilters: Filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        per_page: String(PER_PAGE),
      });
      if (currentFilters.severity) params.set('severity', currentFilters.severity);
      if (currentFilters.status) params.set('status', currentFilters.status);
      if (currentFilters.src_ip) params.set('src_ip', currentFilters.src_ip);

      const res = await api.get<PaginatedResponse<AlertResponse>>(`/alerts?${params.toString()}`);
      setAlerts(res.data.data ?? []);
      const meta = res.data.meta;
      if (meta) {
        setTotal(meta.total);
        setTotalPages(meta.total_pages);
      }
    } catch (e) {
      console.error('Failed to fetch alerts', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts(page, filters);
  }, [page, filters, fetchAlerts]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setPage(1); // reset to first page on filter change
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters(EMPTY_FILTERS);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const handleStatusChange = (id: number, newStatus: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus as AlertStatus } : a))
    );
    if (selectedAlert?.id === id) {
      setSelectedAlert((prev) => prev ? { ...prev, status: newStatus as AlertStatus } : prev);
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      {/* Page header */}
      <div>
        <h1 className="font-headline-md text-[24px] font-bold text-on-surface tracking-tight">
          Alert Center
        </h1>
        <p className="font-body-md text-[14px] text-on-surface-variant">
          Investigate and respond to detected threats. Click any row for details.
        </p>
      </div>

      {/* Filter bar */}
      <div className="glass-panel rounded-lg border border-outline-variant/30 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-label-caps text-[11px] uppercase tracking-widest">Filters</span>
          </div>

          {/* Severity filter */}
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="rounded border border-outline-variant/40 bg-surface-container px-3 py-1.5 font-body-md text-[13px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
          >
            <option value="">All Severities</option>
            {SEVERITY_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="rounded border border-outline-variant/40 bg-surface-container px-3 py-1.5 font-body-md text-[13px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Source IP search */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Filter by source IP..."
              value={filters.src_ip}
              onChange={(e) => handleFilterChange('src_ip', e.target.value)}
              className="rounded border border-outline-variant/40 bg-surface-container pl-8 pr-3 py-1.5 font-code-sm text-[12px] text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim w-48"
            />
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded border border-outline-variant/40 px-3 py-1.5 font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant transition-colors hover:border-secondary-container/50 hover:text-secondary-container"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}

          {/* Results count */}
          <span className="ml-auto font-code-sm text-[11px] text-on-surface-variant">
            {loading ? 'Loading…' : `${total.toLocaleString()} alert${total !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Alert table */}
      <div className="glass-panel flex flex-col overflow-hidden rounded-lg border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
              <tr>
                <th className="px-5 py-3 border-b border-outline-variant/20">Timestamp</th>
                <th className="px-5 py-3 border-b border-outline-variant/20">Severity</th>
                <th className="px-5 py-3 border-b border-outline-variant/20">Signature</th>
                <th className="px-5 py-3 border-b border-outline-variant/20">Source</th>
                <th className="px-5 py-3 border-b border-outline-variant/20">Destination</th>
                <th className="px-5 py-3 border-b border-outline-variant/20">Proto</th>
                <th className="px-5 py-3 border-b border-outline-variant/20">Status</th>
              </tr>
            </thead>
            <tbody className="font-code-sm text-[12px] divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-on-surface-variant">
                    <div className="flex items-center justify-center gap-3">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-fixed-dim border-t-transparent" />
                      Loading alerts...
                    </div>
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-on-surface-variant">
                    No alerts match the current filters.
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="cursor-pointer transition-colors hover:bg-white/5 active:bg-white/10"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 text-on-surface-variant">
                      {format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-5 py-3.5">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td
                      className="max-w-[240px] truncate px-5 py-3.5 font-medium text-on-surface"
                      title={alert.signature}
                    >
                      {alert.signature}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-on-surface-variant">
                      {alert.src_ip}
                      {alert.src_port ? `:${alert.src_port}` : ''}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-on-surface-variant">
                      {alert.dst_ip}
                      {alert.dst_port ? `:${alert.dst_port}` : ''}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">{alert.protocol ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={alert.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-outline-variant/20 px-5 py-3">
            <span className="font-code-sm text-[11px] text-on-surface-variant">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded border border-outline-variant/40 px-3 py-1.5 font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded border border-outline-variant/40 px-3 py-1.5 font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alert detail drawer */}
      {selectedAlert && (
        <AlertDetail
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
