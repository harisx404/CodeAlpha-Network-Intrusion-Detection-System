'use client';

/**
 * Security Reports — export the alert record set for offline analysis.
 *
 * The backend reporting engine is not built yet, so this page generates
 * exports client-side from the existing /alerts endpoint (CSV and JSON).
 */
import { useCallback, useState } from 'react';
import { format } from 'date-fns';
import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/api';

interface AlertRecord {
  id: number;
  timestamp: string;
  signature: string;
  severity: string;
  category: string | null;
  src_ip: string;
  dst_ip: string;
  protocol: string | null;
  status: string;
}

const EXPORT_COLUMNS: Array<keyof AlertRecord> = [
  'id',
  'timestamp',
  'severity',
  'category',
  'signature',
  'src_ip',
  'dst_ip',
  'protocol',
  'status',
];

const MAX_EXPORT_ROWS = 1000;

function escapeCsv(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows: AlertRecord[]): string {
  const header = EXPORT_COLUMNS.join(',');
  const body = rows.map((row) =>
    EXPORT_COLUMNS.map((col) => escapeCsv(row[col])).join(',')
  );
  return [header, ...body].join('\n');
}

function downloadFile(contents: string, filename: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [format_, setFormat] = useState<'csv' | 'json'>('csv');
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = useCallback(async () => {
    setGenerating(true);
    setMessage(null);
    setError(null);
    try {
      const res = await api.get<PaginatedResponse<AlertRecord>>(
        `/alerts?page=1&per_page=${MAX_EXPORT_ROWS}`
      );
      const rows = res.data.data ?? [];
      if (rows.length === 0) {
        setError('No alerts available to export.');
        return;
      }

      const stamp = format(new Date(), 'yyyyMMdd-HHmmss');
      if (format_ === 'csv') {
        downloadFile(toCsv(rows), `nids-alerts-${stamp}.csv`, 'text/csv;charset=utf-8');
      } else {
        downloadFile(
          JSON.stringify(rows, null, 2),
          `nids-alerts-${stamp}.json`,
          'application/json'
        );
      }
      setMessage(`Exported ${rows.length} alert${rows.length === 1 ? '' : 's'} as ${format_.toUpperCase()}.`);
    } catch (e) {
      console.error('Report export failed', e);
      setError('Failed to generate the report. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [format_]);

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="font-headline-md text-[24px] font-bold tracking-tight text-on-surface">
          Security Reports
        </h1>
        <p className="font-body-md text-[14px] text-on-surface-variant">
          Export detected alerts for offline analysis and compliance records.
        </p>
      </div>

      <div className="glass-panel rounded-lg border border-outline-variant/30 p-6">
        <h2 className="mb-1 font-headline-sm text-[18px] font-semibold text-on-surface">
          Alert Export
        </h2>
        <p className="mb-4 font-body-md text-[14px] text-on-surface-variant">
          Generates a snapshot of the most recent alerts (up to {MAX_EXPORT_ROWS.toLocaleString()} records).
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
              Format
            </span>
            <select
              value={format_}
              onChange={(e) => setFormat(e.target.value as 'csv' | 'json')}
              className="rounded border border-outline-variant/40 bg-surface-container px-3 py-2 font-body-md text-[14px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </label>

          <button
            onClick={handleExport}
            disabled={generating}
            className="rounded bg-primary-fixed-dim/20 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-primary-fixed-dim transition-colors hover:bg-primary-fixed-dim/30 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {message && (
          <p className="mt-4 font-body-md text-[14px] text-primary-fixed-dim">{message}</p>
        )}
        {error && (
          <p className="mt-4 font-body-md text-[14px] text-secondary-container">{error}</p>
        )}
      </div>

      <div className="rounded-lg border border-dashed border-outline-variant/30 bg-surface-container/40 p-6">
        <p className="font-body-md text-[14px] text-on-surface-variant">
          Scheduled server-side report generation (automated daily and weekly threat-intelligence
          summaries) is planned but not yet available. Exports above are generated in your browser
          from live alert data.
        </p>
      </div>
    </div>
  );
}
