'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import type { ApiResponse } from '@/types/api';
import type { Rule } from '@/types/rule';
import type { SeverityLevel } from '@/types/alert';

const SEVERITY_OPTIONS: SeverityLevel[] = ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

interface NewRuleForm {
  sid: string;
  name: string;
  body: string;
  is_active: boolean;
  severity: SeverityLevel;
  category: string;
}

const EMPTY_RULE: NewRuleForm = {
  sid: '',
  name: '',
  body: '',
  is_active: true,
  severity: 'INFO',
  category: 'Misc',
};

export default function RulesPage() {
  const { notify } = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState<NewRuleForm>(EMPTY_RULE);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await api.get<ApiResponse<Rule[]>>('/rules');
        setRules(res.data.data ?? []);
      } catch (e) {
        console.error('Failed to fetch rules', e);
        notify('Failed to load rules.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, [notify]);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<ApiResponse<Rule>>('/rules', {
        sid: parseInt(newRule.sid, 10),
        name: newRule.name,
        body: newRule.body,
        is_active: newRule.is_active,
        severity: newRule.severity,
        category: newRule.category,
      });
      const created = res.data.data;
      if (created) {
        setRules((prev) => [...prev, created]);
        setIsModalOpen(false);
        setNewRule(EMPTY_RULE);
        notify('Rule created successfully.');
      }
    } catch (e) {
      console.error('Failed to add rule', e);
      notify('Failed to add rule. Ensure the SID is unique.', 'error');
    }
  };

  const handleDeleteRule = async () => {
    if (pendingDeleteId === null) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await api.delete(`/rules/${id}`);
      setRules((prev) => prev.filter((r) => r.id !== id));
      notify('Rule deleted.');
    } catch (e) {
      console.error('Failed to delete rule', e);
      notify('Failed to delete rule.', 'error');
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-[24px] font-bold text-on-surface tracking-tight">
            Detection Rules
          </h1>
          <p className="font-body-md text-[14px] text-on-surface-variant">
            Manage custom Suricata signatures.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded bg-primary-fixed-dim/20 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-primary-fixed-dim transition-colors hover:bg-primary-fixed-dim/30"
        >
          Add New Rule
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-lg border border-outline-variant/40 p-6">
            <h2 className="mb-4 font-headline-sm text-[18px] font-semibold text-on-surface">
              Add New Rule
            </h2>
            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="mb-1 block font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
                  SID
                </label>
                <input
                  required
                  type="number"
                  value={newRule.sid}
                  onChange={(e) => setNewRule({ ...newRule, sid: e.target.value })}
                  className="w-full rounded border border-outline-variant/40 bg-surface-container px-3 py-2 font-code-sm text-[12px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
                  placeholder="e.g. 1000010"
                />
              </div>
              <div>
                <label className="mb-1 block font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
                  Rule Name
                </label>
                <input
                  required
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full rounded border border-outline-variant/40 bg-surface-container px-3 py-2 font-body-md text-[14px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
                  placeholder="e.g. Detect SQL Injection"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
                    Severity
                  </label>
                  <select
                    value={newRule.severity}
                    onChange={(e) =>
                      setNewRule({ ...newRule, severity: e.target.value as SeverityLevel })
                    }
                    className="w-full rounded border border-outline-variant/40 bg-surface-container px-3 py-2 font-body-md text-[14px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
                  >
                    {SEVERITY_OPTIONS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    className="w-full rounded border border-outline-variant/40 bg-surface-container px-3 py-2 font-body-md text-[14px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
                    placeholder="e.g. Web Attack"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
                  Rule Content (Suricata Format)
                </label>
                <textarea
                  required
                  value={newRule.body}
                  onChange={(e) => setNewRule({ ...newRule, body: e.target.value })}
                  className="w-full rounded border border-outline-variant/40 bg-surface-container px-3 py-2 font-code-sm text-[12px] text-on-surface focus:border-primary-fixed-dim focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim"
                  rows={4}
                  placeholder='alert http any any -> any any (msg:"Test"; sid:1000010;)'
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded border border-outline-variant/50 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary-fixed-dim/20 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-primary-fixed-dim transition-colors hover:bg-primary-fixed-dim/30"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full p-8 text-center text-on-surface-variant">
            Loading rules...
          </div>
        ) : rules.length === 0 ? (
          <div className="col-span-full rounded-lg border-2 border-dashed border-outline-variant/30 p-8 text-center">
            <p className="text-on-surface-variant">No custom rules configured yet.</p>
          </div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id}
              className="glass-panel flex flex-col rounded-lg border border-outline-variant/30 p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3
                    className="truncate font-headline-sm text-[16px] font-semibold text-on-surface"
                    title={rule.name}
                  >
                    {rule.name}
                  </h3>
                  <p className="mt-1 font-code-sm text-[11px] text-on-surface-variant">
                    SID: {rule.sid}
                  </p>
                </div>
                <span
                  className={
                    rule.is_active
                      ? 'rounded bg-primary-fixed-dim/15 px-2 py-0.5 font-label-caps text-[10px] font-bold uppercase tracking-wide text-primary-fixed-dim'
                      : 'rounded bg-surface-variant/40 px-2 py-0.5 font-label-caps text-[10px] font-bold uppercase tracking-wide text-on-surface-variant'
                  }
                >
                  {rule.is_active ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <SeverityBadge severity={rule.severity} />
                <span className="font-code-sm text-[11px] text-on-surface-variant">
                  {rule.category}
                </span>
              </div>
              <div className="flex-1 overflow-hidden whitespace-pre-wrap break-all rounded bg-surface-container-low p-3 font-code-sm text-[11px] text-on-surface-variant">
                {rule.body && rule.body.length > 100
                  ? `${rule.body.substring(0, 100)}...`
                  : rule.body}
              </div>
              <div className="mt-4 flex">
                <button
                  onClick={() => setPendingDeleteId(rule.id)}
                  className="w-full rounded border border-secondary-container/30 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-secondary-container transition-colors hover:bg-secondary-container/15"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete rule"
        message="This will permanently remove the detection rule. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteRule}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
