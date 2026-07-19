import { severityStyle } from "@/lib/severity";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

/**
 * Single source of truth for rendering a severity/status pill.
 * Used across the alert feed, alerts table, rules, and monitoring views.
 */
export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const { badge } = severityStyle(severity);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 font-code-sm text-[11px] font-semibold uppercase tracking-wide",
        badge,
        className
      )}
    >
      {severity}
    </span>
  );
}
