import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  isLoading?: boolean;
  variant?: 'default' | 'critical' | 'amber' | 'cyan';
}

interface VariantStyle {
  panel: string;
  icon: string;
  value: string;
  tag: string;
  tagText: string;
}

const VARIANTS: Record<NonNullable<StatCardProps['variant']>, VariantStyle> = {
  default: {
    panel: '',
    icon: 'text-on-surface-variant',
    value: 'text-on-surface',
    tag: 'text-on-surface-variant',
    tagText: 'LIVE',
  },
  critical: {
    panel: ' border-secondary-container/30 critical-pulse',
    icon: 'text-secondary-container',
    value: 'text-secondary-container',
    tag: 'text-secondary-container',
    tagText: 'URGENT',
  },
  amber: {
    panel: '',
    icon: 'text-tertiary-fixed-dim',
    value: 'text-on-surface',
    tag: 'text-tertiary-fixed-dim',
    tagText: 'MONITORED',
  },
  cyan: {
    panel: ' inner-glow-cyan',
    icon: 'text-primary-fixed-dim',
    value: 'text-on-surface',
    tag: 'text-primary-fixed-dim',
    tagText: 'LIVE',
  },
};

export function StatCard({ title, value, icon: Icon, isLoading, variant = 'default' }: StatCardProps) {
  const style = VARIANTS[variant];

  return (
    <div
      className={`glass-panel p-panel-padding rounded-lg flex flex-col justify-between h-32 relative overflow-hidden group${style.panel}`}
    >
      <div className={`absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity ${style.icon}`}>
        <Icon className="h-24 w-24" strokeWidth={1.5} />
      </div>

      <div className="flex justify-between items-start z-10 relative">
        <span className="font-label-caps text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">
          {title}
        </span>
        <span className={`font-label-caps text-[10px] flex items-center ${style.tag}`}>{style.tagText}</span>
      </div>

      <div className="z-10 relative flex items-center gap-3">
        <Icon className={`h-6 w-6 flex-shrink-0 ${style.icon}`} strokeWidth={2} />
        <span className={`font-headline-md text-[24px] font-bold ${style.value}`}>
          {isLoading ? '...' : value}
        </span>
      </div>
    </div>
  );
}
