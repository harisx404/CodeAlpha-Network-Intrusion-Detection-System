'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  AlertTriangle,
  ShieldAlert,
  Activity,
  Settings,
  FileText,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Rules', href: '/rules', icon: ShieldAlert },
  { name: 'Monitoring', href: '/monitoring', icon: Activity },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

/** Active when the current path equals the item or is a nested segment of it. */
function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarProps {
  /** Whether the mobile drawer is open (ignored at md+ where it's always shown). */
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-outline-variant/30 bg-surface-container transition-transform duration-200 md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-outline-variant/30 px-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary-fixed-dim" strokeWidth={2} />
            <span className="font-headline-sm text-[16px] font-bold text-on-surface">
              NIDS Platform
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="text-on-surface-variant transition-colors hover:text-on-surface md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navigation.map((item) => {
            const isActive = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center rounded px-3 py-2 font-body-md text-[14px] font-medium transition-colors',
                  isActive
                    ? 'bg-primary-fixed-dim/15 text-primary-fixed-dim'
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-primary-fixed-dim'
                      : 'text-on-surface-variant group-hover:text-on-surface'
                  )}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
