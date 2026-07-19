import { Radar } from 'lucide-react';
import type { TopAttacker } from '@/types/stats';

interface TopAttackersProps {
  attackers: TopAttacker[];
}

export function TopAttackers({ attackers }: TopAttackersProps) {
  const hasData = attackers && attackers.length > 0;

  return (
    <div className="glass-panel rounded-lg overflow-hidden flex flex-col h-[400px] border border-outline-variant/30">
      <div className="p-panel-padding border-b border-outline-variant/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Radar className="h-5 w-5 text-secondary-container" strokeWidth={2} />
          <h2 className="font-headline-sm text-[18px] font-semibold">Top Threat Actors</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasData ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-on-surface-variant px-4 text-center">No persistent threats detected.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container font-label-caps text-[11px] text-on-surface-variant z-10 shadow-sm">
              <tr>
                <th className="p-4 border-b border-outline-variant/20">Source IP</th>
                <th className="p-4 border-b border-outline-variant/20 text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="font-code-sm text-[12px] divide-y divide-outline-variant/10">
              {attackers.map((attacker) => (
                <tr key={attacker.ip} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="p-4 text-on-surface font-medium">
                    {attacker.ip}{' '}
                    <span className="text-on-surface-variant">
                      {attacker.country ? `(${attacker.country})` : ''}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-secondary-container/10 text-secondary-container border border-secondary-container/20">
                      {attacker.count} alerts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
