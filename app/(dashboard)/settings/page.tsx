'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

type HealthState = 'checking' | 'online' | 'offline';

export default function SettingsPage() {
  const { notify } = useToast();
  const [reloading, setReloading] = useState(false);
  const [health, setHealth] = useState<HealthState>('checking');

  const checkHealth = useCallback(async () => {
    try {
      const res = await api.get<{ status: string }>('/system/health');
      setHealth(res.data.status === 'ok' ? 'online' : 'offline');
    } catch {
      setHealth('offline');
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const handleReload = async () => {
    setReloading(true);
    try {
      await api.post('/system/suricata/reload');
      notify('Suricata rules reloaded successfully.');
    } catch {
      notify('Failed to reload rules. The detection engine may be unreachable.', 'error');
    } finally {
      setReloading(false);
    }
  };

  const healthLabel: Record<HealthState, string> = {
    checking: 'Checking...',
    online: 'Online',
    offline: 'Unreachable',
  };

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="font-headline-md text-[24px] font-bold tracking-tight text-on-surface">
          Settings
        </h1>
        <p className="font-body-md text-[14px] text-on-surface-variant">
          Manage your NIDS configuration and detection engine.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel rounded-lg border border-outline-variant/30 p-6">
          <h2 className="mb-4 font-headline-sm text-[18px] font-semibold text-on-surface">
            API Service
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body-md text-[14px] font-medium text-on-surface">Backend Status</p>
              <p className="font-code-sm text-[12px] text-on-surface-variant">
                Liveness of the NIDS API service
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  health === 'online'
                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                    : health === 'offline'
                      ? 'bg-secondary-container shadow-[0_0_8px_rgba(255,80,110,0.6)]'
                      : 'bg-on-surface-variant'
                }`}
              />
              <span className="font-label-caps text-[11px] font-bold uppercase tracking-widest text-on-surface">
                {healthLabel[health]}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-lg border border-outline-variant/30 p-6">
          <h2 className="mb-4 font-headline-sm text-[18px] font-semibold text-on-surface">
            Detection Engine
          </h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-body-md text-[14px] font-medium text-on-surface">Suricata Rules</p>
              <p className="font-code-sm text-[12px] text-on-surface-variant">
                Hot-reload the active ruleset without restarting
              </p>
            </div>
            <button
              onClick={handleReload}
              disabled={reloading}
              className="flex items-center gap-2 rounded bg-primary-fixed-dim/20 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-primary-fixed-dim transition-colors hover:bg-primary-fixed-dim/30 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${reloading ? 'animate-spin' : ''}`} />
              {reloading ? 'Reloading...' : 'Reload Rules'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
