'use client';

import { useState } from 'react';
import { X, CheckCircle, XCircle, Globe, Cpu } from 'lucide-react';
import { format } from 'date-fns';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { AlertResponse } from '@/types/alert';

interface AlertDetailProps {
  alert: AlertResponse;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: string) => void;
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
        {label}
      </span>
      <span className="font-code-sm text-[12px] text-on-surface">{value ?? '—'}</span>
    </div>
  );
}

export function AlertDetail({ alert, onClose, onStatusChange }: AlertDetailProps) {
  const { notify } = useToast();
  const [loading, setLoading] = useState<'acknowledge' | 'resolve' | null>(null);

  const handleAcknowledge = async () => {
    if (alert.status !== 'NEW') return;
    setLoading('acknowledge');
    try {
      await api.post(`/alerts/${alert.id}/acknowledge`);
      onStatusChange(alert.id, 'ACKNOWLEDGED');
      notify('Alert acknowledged.');
    } catch {
      notify('Failed to acknowledge alert.', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleResolve = async () => {
    if (alert.status === 'RESOLVED') return;
    setLoading('resolve');
    try {
      await api.post(`/alerts/${alert.id}/resolve`);
      onStatusChange(alert.id, 'RESOLVED');
      notify('Alert resolved.');
    } catch {
      notify('Failed to resolve alert.', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col bg-surface-container shadow-2xl border-l border-outline-variant/30 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <SeverityBadge severity={alert.severity} />
            <span className="font-headline-sm text-[16px] font-semibold text-on-surface">
              Alert #{alert.id}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close detail"
            className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Signature */}
          <div>
            <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
              Signature
            </p>
            <p className="font-body-md text-[14px] font-medium text-on-surface leading-snug">
              {alert.signature}
            </p>
            {alert.category && (
              <p className="mt-1 font-code-sm text-[11px] text-on-surface-variant">
                {alert.category}
              </p>
            )}
          </div>

          {/* Timestamp & Status */}
          <div className="grid grid-cols-2 gap-4">
            <InfoRow
              label="Timestamp"
              value={format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss')}
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
                Status
              </span>
              <span
                className={`inline-block w-fit rounded px-2 py-0.5 font-label-caps text-[10px] font-bold uppercase tracking-wide ${
                  alert.status === 'NEW'
                    ? 'bg-primary-fixed-dim/15 text-primary-fixed-dim'
                    : alert.status === 'ACKNOWLEDGED'
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-green-500/15 text-green-400'
                }`}
              >
                {alert.status}
              </span>
            </div>
          </div>

          {/* Network section */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
              <Cpu className="h-3.5 w-3.5" /> Network
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Source IP" value={alert.src_ip} />
              <InfoRow label="Source Port" value={alert.src_port} />
              <InfoRow label="Destination IP" value={alert.dst_ip} />
              <InfoRow label="Destination Port" value={alert.dst_port} />
              <InfoRow label="Protocol" value={alert.protocol} />
              <InfoRow label="Signature ID" value={alert.signature_id} />
            </div>
          </div>

          {/* Geo section */}
          {alert.geo && (alert.geo.country || alert.geo.city) && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
                <Globe className="h-3.5 w-3.5" /> Geolocation
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Country" value={alert.geo.country} />
                <InfoRow label="City" value={alert.geo.city} />
                {alert.geo.latitude && (
                  <InfoRow
                    label="Coordinates"
                    value={`${alert.geo.latitude}, ${alert.geo.longitude}`}
                  />
                )}
              </div>
            </div>
          )}

          {/* Raw EVE JSON */}
          {alert.raw_eve && (
            <div>
              <p className="mb-2 font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
                Raw EVE JSON
              </p>
              <pre className="overflow-x-auto rounded bg-surface-container-low p-4 font-code-sm text-[11px] text-on-surface-variant leading-relaxed max-h-64">
                {JSON.stringify(alert.raw_eve, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="border-t border-outline-variant/20 px-6 py-4 flex gap-3">
          <button
            onClick={handleAcknowledge}
            disabled={alert.status !== 'NEW' || loading === 'acknowledge'}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-amber-500/15 px-4 py-2.5 font-label-caps text-[11px] font-bold uppercase tracking-widest text-amber-400 transition-colors hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle className="h-4 w-4" />
            {loading === 'acknowledge' ? 'Working...' : 'Acknowledge'}
          </button>
          <button
            onClick={handleResolve}
            disabled={alert.status === 'RESOLVED' || loading === 'resolve'}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-green-500/15 px-4 py-2.5 font-label-caps text-[11px] font-bold uppercase tracking-widest text-green-400 transition-colors hover:bg-green-500/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <XCircle className="h-4 w-4" />
            {loading === 'resolve' ? 'Working...' : 'Resolve'}
          </button>
        </div>
      </div>
    </>
  );
}
