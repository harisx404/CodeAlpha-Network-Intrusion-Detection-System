/**
 * Central mapping of alert severities to SOC-theme colour tokens.
 *
 * Keeping this in one place guarantees every badge, chart, and indicator
 * across the app reads the same colour for a given severity.
 */

export type SeverityKey = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

interface SeverityStyle {
  /** Tailwind classes for a filled/soft badge (background + text + border). */
  badge: string;
  /** Bare text colour token, for inline labels and icons. */
  text: string;
  /** Raw hex, for chart fills and inline SVG styling. */
  hex: string;
}

const DEFAULT_STYLE: SeverityStyle = {
  badge: "bg-surface-variant/40 text-on-surface-variant border border-outline-variant/40",
  text: "text-on-surface-variant",
  hex: "#b9cacb",
};

const SEVERITY_STYLES: Record<SeverityKey, SeverityStyle> = {
  CRITICAL: {
    badge: "bg-secondary-container/15 text-secondary-container border border-secondary-container/30",
    text: "text-secondary-container",
    hex: "#ff506e",
  },
  HIGH: {
    badge: "bg-secondary-container/15 text-secondary-container border border-secondary-container/30",
    text: "text-secondary-container",
    hex: "#ff506e",
  },
  MEDIUM: {
    badge: "bg-tertiary-fixed-dim/15 text-tertiary-fixed-dim border border-tertiary-fixed-dim/30",
    text: "text-tertiary-fixed-dim",
    hex: "#ffba20",
  },
  LOW: {
    badge: "bg-primary-fixed-dim/15 text-primary-fixed-dim border border-primary-fixed-dim/30",
    text: "text-primary-fixed-dim",
    hex: "#00dbe7",
  },
  INFO: DEFAULT_STYLE,
};

export function severityStyle(severity: string | null | undefined): SeverityStyle {
  if (!severity) return DEFAULT_STYLE;
  return SEVERITY_STYLES[severity.toUpperCase() as SeverityKey] ?? DEFAULT_STYLE;
}
