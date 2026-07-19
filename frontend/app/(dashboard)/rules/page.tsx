'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

type Rule = {
  id: number;
  sid: number;
  name: string;
  body: string;
  is_active: boolean;
  severity: string;
  category: string;
};

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({ sid: '', name: '', body: '', is_active: true, severity: 'INFO', category: 'Misc' });

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/rules', {
        sid: parseInt(newRule.sid),
        name: newRule.name,
        body: newRule.body,
        is_active: newRule.is_active,
        severity: newRule.severity,
        category: newRule.category
      });
      const created = res.data?.data;
      if (created) {
        setRules((prev) => [...prev, created]);
        setIsModalOpen(false);
        setNewRule({ sid: '', name: '', body: '', is_active: true, severity: 'INFO', category: 'Misc' });
      }
    } catch (e) {
      console.error("Failed to add rule", e);
      alert("Failed to add rule. Ensure SID is unique.");
    }
  };

  const handleDeleteRule = async (id: number) => {
    if (!confirm('Delete this rule? This cannot be undone.')) return;
    try {
      await api.delete(`/rules/${id}`);
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error('Failed to delete rule', e);
      alert('Failed to delete rule.');
    }
  };

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await api.get('/rules');
        setRules(res.data?.data ?? []);
      } catch (e) {
        console.error("Failed to fetch rules", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  return (
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Detection Rules</h2>
            <p className="text-muted-foreground">Manage custom Suricata signatures.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Add New Rule
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Add New Rule</h3>
              <form onSubmit={handleAddRule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SID</label>
                  <input required type="number" value={newRule.sid} onChange={e => setNewRule({...newRule, sid: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" placeholder="e.g. 1000010" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rule Name</label>
                  <input required type="text" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" placeholder="e.g. Detect SQL Injection" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rule Content (Suricata Format)</label>
                  <textarea required value={newRule.body} onChange={e => setNewRule({...newRule, body: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono" rows={4} placeholder='alert http any any -> any any (msg:"Test"; sid:1000010;)'></textarea>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Save Rule</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center text-muted-foreground">Loading rules...</div>
          ) : rules.length === 0 ? (
            <div className="col-span-full p-8 text-center border-2 border-dashed border-border rounded-xl">
              <p className="text-muted-foreground">No custom rules configured yet.</p>
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="border border-border bg-card rounded-xl p-5 flex flex-col shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg truncate" title={rule.name}>{rule.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">SID: {rule.sid}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${rule.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                    {rule.is_active ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex-1 bg-muted/30 p-3 rounded-md overflow-hidden text-xs font-mono text-muted-foreground break-all whitespace-pre-wrap">
                  {rule.body && rule.body.length > 100 ? `${rule.body.substring(0, 100)}...` : rule.body}
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-md text-sm font-medium hover:bg-secondary/80">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="px-3 bg-secondary text-destructive py-2 rounded-md text-sm font-medium hover:bg-destructive/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  );
}
