'use client';

export default function MonitoringPage() {
  return (
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Monitoring</h2>
          <p className="text-muted-foreground">Live health metrics for NIDS components.</p>
        </div>
        
        <div className="p-8 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <p className="text-muted-foreground mb-4">Monitoring dashboard is under construction.</p>
          <p className="text-sm text-muted-foreground">Future updates will include live CPU/RAM usage of Suricata, storage trends, and interface traffic statistics.</p>
        </div>
      </div>
  );
}
