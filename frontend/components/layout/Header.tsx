'use client';

import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import api from '@/lib/api';

export function Header() {
  const { isConnected } = useWebSocket();
  const [criticalCount, setCriticalCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/statistics/summary');
        if (res.data) {
          setCriticalCount(res.data.alerts_critical || 0);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
    // In a real app we'd listen to the websocket here to increment
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">Security Operations Center</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center mr-4">
          <span className={`h-2.5 w-2.5 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
          <span className="text-sm text-muted-foreground">{isConnected ? 'Live' : 'Disconnected'}</span>
        </div>
        <button className="text-muted-foreground hover:text-foreground relative">
          <Bell className="h-5 w-5" />
          {criticalCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {criticalCount > 99 ? '99+' : criticalCount}
            </span>
          )}
        </button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
