'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, User, Menu, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/hooks/useWebSocket';
import api, { clearStoredToken } from '@/lib/api';
import type { ApiResponse } from '@/types/api';

interface StatsSummary {
  alerts_critical: number;
}

interface UserProfile {
  username: string;
  email: string;
  role: string;
}

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { isConnected } = useWebSocket();
  const [criticalCount, setCriticalCount] = useState(0);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<ApiResponse<StatsSummary>>('/statistics/summary');
        setCriticalCount(res.data.data?.alerts_critical ?? 0);
      } catch (e) {
        console.error('Failed to load alert summary', e);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await api.get<UserProfile>('/auth/me');
        setUser(res.data);
      } catch (e) {
        console.error('Failed to fetch user profile', e);
      }
    };
    fetchStats();
    fetchUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    clearStoredToken();
    router.push('/login');
  };

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
        {/* WebSocket connection indicator */}
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

        {/* Critical alerts bell */}
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

        {/* User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 rounded px-2 py-1 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
            aria-label="User menu"
            aria-expanded={dropdownOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed-dim/20">
              <User className="h-4 w-4 text-primary-fixed-dim" />
            </div>
            <span className="hidden font-body-md text-[13px] font-medium text-on-surface md:block">
              {user?.username ?? 'admin'}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-on-surface-variant transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container shadow-xl">
              {/* User info block */}
              <div className="border-b border-outline-variant/20 px-4 py-3">
                <p className="font-body-md text-[13px] font-semibold text-on-surface">
                  {user?.username ?? 'admin'}
                </p>
                <p className="font-code-sm text-[11px] text-on-surface-variant">
                  {user?.email ?? ''}
                </p>
                {user?.role && (
                  <span className="mt-1 inline-block rounded bg-primary-fixed-dim/15 px-1.5 py-0.5 font-label-caps text-[10px] font-bold uppercase tracking-wide text-primary-fixed-dim">
                    {user.role}
                  </span>
                )}
              </div>

              {/* Menu items */}
              <div className="py-1">
                <a
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 font-body-md text-[13px] text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 font-body-md text-[13px] text-secondary-container transition-colors hover:bg-secondary-container/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
