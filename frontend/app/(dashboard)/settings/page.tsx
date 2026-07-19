'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function SettingsPage() {
  const [restarting, setRestarting] = useState(false);
  const [reloading, setReloading] = useState(false);

  const handleRestart = async () => {
    setRestarting(true);
    try {
      await api.post('/system/suricata/restart');
      alert('Suricata restarted successfully');
    } catch (e) {
      alert('Failed to restart Suricata');
    } finally {
      setRestarting(false);
    }
  };

  const handleReload = async () => {
    setReloading(true);
    try {
      await api.post('/system/suricata/reload');
      alert('Rules reloaded successfully');
    } catch (e) {
      alert('Failed to reload rules');
    } finally {
      setReloading(false);
    }
  };

  return (
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your NIDS configuration and preferences.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Response Handlers</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Slack Webhook</p>
                  <p className="text-sm text-muted-foreground">Send HIGH/CRITICAL alerts to Slack</p>
                </div>
                <button className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm font-medium">Configure</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Email admin on CRITICAL alerts</p>
                </div>
                <button className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm font-medium">Configure</button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Suricata Engine</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Engine Status</p>
                  <p className="text-sm text-green-500 font-medium">Running</p>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={handleRestart}
                    disabled={restarting}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm font-medium hover:bg-secondary/80 disabled:opacity-50"
                  >
                    {restarting ? 'Restarting...' : 'Restart'}
                  </button>
                  <button 
                    onClick={handleReload}
                    disabled={reloading}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm font-medium hover:bg-secondary/80 disabled:opacity-50"
                  >
                    {reloading ? 'Reloading...' : 'Reload Rules'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
