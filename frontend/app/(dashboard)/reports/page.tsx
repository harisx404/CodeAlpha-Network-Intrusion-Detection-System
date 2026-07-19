'use client';

export default function ReportsPage() {
  return (
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Reports</h2>
          <p className="text-muted-foreground">Generate and export compliance reports.</p>
        </div>
        
        <div className="p-8 text-center border-2 border-dashed border-border rounded-xl bg-card">
          <p className="text-muted-foreground mb-4">Reporting engine is under construction.</p>
          <p className="text-sm text-muted-foreground">Future updates will include automated PDF and CSV export generation for daily/weekly threat intelligence reports.</p>
        </div>
      </div>
  );
}
