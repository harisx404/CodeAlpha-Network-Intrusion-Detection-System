/**
 * Dashboard home page — executive security posture overview.
 *
 * Shows real-time KPI cards, live alert feed, and traffic charts.
 * All data fetched client-side to support real-time updates.
 */
"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, Scroll, Database } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { SeverityDonut } from "@/components/dashboard/SeverityDonut";
import { TrafficTimeline } from "@/components/dashboard/TrafficTimeline";
import { TopAttackers } from "@/components/dashboard/TopAttackers";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { DashboardStats } from "@/types/stats";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<ApiResponse<DashboardStats>>(
          "/statistics/dashboard"
        );
        setStats(res.data.data);
      } catch {
        setError("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30_000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="font-display-lg text-[48px] font-bold text-on-surface tracking-tight">Security Command</h1>
          <p className="font-body-md text-[14px] text-on-surface-variant">
            Real-time threat landscape monitoring across global nodes.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-surface-container px-3 py-1.5 rounded flex items-center gap-2 border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="font-label-caps text-[11px] font-bold tracking-widest text-on-surface">Network Status: Nominal</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard
          title="Total Alerts Today"
          value={stats.total_alerts_today}
          icon={AlertTriangle}
          isLoading={isLoading}
        />
        <StatCard
          title="Critical / High"
          value={stats.critical_alerts_today}
          icon={ShieldAlert}
          variant="critical"
          isLoading={isLoading}
        />
        <StatCard
          title="Active Rules"
          value={stats.active_rules_count}
          icon={Scroll}
          variant="amber"
          isLoading={isLoading}
        />
        <StatCard
          title="Packets Analyzed"
          value={stats.packets_analyzed}
          icon={Database}
          variant="cyan"
          isLoading={isLoading}
        />
      </div>

      {/* Charts and Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-8">
        <div className="lg:col-span-2">
          <AlertFeed />
        </div>
        <div>
          <SeverityDonut data={stats.alerts_by_severity} />
        </div>
      </div>

      {/* Timeline and Top Attackers */}
      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficTimeline data={stats.alerts_trend_24h} />
        </div>
        <div className="lg:col-span-1">
          <TopAttackers attackers={stats.top_src_ips} />
        </div>
      </div>
    </div>
  );
}
