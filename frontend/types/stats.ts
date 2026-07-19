/**
 * TypeScript types for dashboard statistics.
 *
 * Mirrors the payload returned by GET /statistics/dashboard on the backend.
 */

export interface SeverityBreakdown {
  CRITICAL?: number;
  HIGH?: number;
  MEDIUM?: number;
  LOW?: number;
  INFO?: number;
}

export interface AlertTrendPoint {
  hour: string;
  count: number;
}

export interface TopAttacker {
  ip: string;
  country: string | null;
  count: number;
}

export interface DashboardStats {
  total_alerts_today: number;
  critical_alerts_today: number;
  active_rules_count: number;
  packets_analyzed: number;
  alerts_by_severity: SeverityBreakdown;
  alerts_trend_24h: AlertTrendPoint[];
  top_src_ips: TopAttacker[];
}
