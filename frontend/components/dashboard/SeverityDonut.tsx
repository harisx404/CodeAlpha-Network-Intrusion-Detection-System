'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { severityStyle } from '@/lib/severity';
import type { SeverityBreakdown } from '@/types/stats';

interface SeverityDonutProps {
  data: SeverityBreakdown;
}

export function SeverityDonut({ data }: SeverityDonutProps) {
  // Collapse the five severity levels into three display buckets so the donut
  // stays readable, borrowing colours from the shared severity palette.
  const formattedData = [
    {
      name: 'Critical/High',
      value: (data?.CRITICAL ?? 0) + (data?.HIGH ?? 0),
      color: severityStyle('CRITICAL').hex,
    },
    {
      name: 'Medium',
      value: data?.MEDIUM ?? 0,
      color: severityStyle('MEDIUM').hex,
    },
    {
      name: 'Low/Info',
      value: (data?.LOW ?? 0) + (data?.INFO ?? 0),
      color: severityStyle('LOW').hex,
    },
  ].filter((item) => item.value > 0);

  const total = formattedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="glass-panel rounded-lg p-panel-padding flex flex-col h-full border border-outline-variant/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-sm text-[18px] font-semibold">Severity Distribution</h2>
        <PieChartIcon className="h-5 w-5 text-on-surface-variant" strokeWidth={2} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="w-full h-48 relative">
          {total === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  stroke="none"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {formattedData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#122131',
                    borderColor: '#3a494b',
                    borderRadius: '8px',
                    color: '#d4e4fa',
                  }}
                  itemStyle={{ color: '#d4e4fa' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {total > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-headline-md text-[24px] font-bold text-on-surface">
                {total > 1000 ? (total / 1000).toFixed(1) + 'k' : total}
              </span>
              <span className="font-label-caps text-[9px] text-on-surface-variant">TOTAL</span>
            </div>
          )}
        </div>

        <div className="mt-8 w-full space-y-3">
          {formattedData.map((item) => (
            <div key={item.name} className="flex justify-between items-center text-body-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-on-surface-variant">{item.name}</span>
              </div>
              <span className="font-code-sm font-bold text-[12px]">
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
