'use client';

import { useEffect, useState } from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';

interface StatsSummary {
  alerts_critical: number;
}

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { isConnected } = useWebSocket();
  const [criticalCount, setCriticalCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<ApiResponse<StatsSummary>>('/statistics/summary');
        setCriticalCount(res.data.data?.alerts_critical ?? 0);
      } catch (e) {
        console.error('Failed to load alert summary', e);
      }
    };
    fetchStats();
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-outline-variant/30 bg-surface-container px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="text-on-surface-variant transition-colors hover:text-on-surface md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="font-headline-sm text-[18px] font-semibold text-on-surface">
          Security Operations Center
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isConnected
                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                : 'animate-pulse bg-secondary-container'
            }`}
          />
          <span className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
        <button
          className="relative text-on-surface-variant transition-colors hover:text-on-surface"
          aria-label={`Notifications${criticalCount > 0 ? `, ${criticalCount} critical` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {criticalCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container text-[10px] font-bold text-on-surface">
              {criticalCount > 99 ? '99+' : criticalCount}
            </span>
          )}
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-variant">
          <User className="h-5 w-5 text-on-surface-variant" />
        </div>
      </div>
    </header>
  );
}
