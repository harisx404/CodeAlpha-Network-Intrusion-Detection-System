'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AlertTrendPoint } from '@/types/stats';

interface TrafficTimelineProps {
  data: AlertTrendPoint[];
}

export function TrafficTimeline({ data }: TrafficTimelineProps) {
  const chartData = data ?? [];

  return (
    <div className="glass-panel rounded-lg p-panel-padding w-full h-[400px] flex flex-col border border-outline-variant/30">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-headline-sm text-[18px] font-semibold">Alert Timeline</h2>
          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Alerts Per Hour • 24H Trend</p>
        </div>
        <div className="flex gap-4 font-label-caps text-[11px] font-bold text-on-surface uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-fixed-dim shadow-[0_0_8px_rgba(0,219,231,0.6)]"></span> 
            Alerts
          </span>
        </div>
      </div>
      
      <div className="flex-1 relative mt-4">
        {chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm">
            No timeline data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00dbe7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00dbe7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
              <XAxis 
                dataKey="hour" 
                tick={{ fill: '#b9cacb', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#3a494b', strokeWidth: 1 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fill: '#b9cacb', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#122131', 
                  borderColor: '#3a494b',
                  borderRadius: '8px',
                  color: '#d4e4fa',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#00dbe7' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                name="Alerts"
                stroke="#00dbe7" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCount)" 
                activeDot={{ r: 4, fill: '#00dbe7', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
