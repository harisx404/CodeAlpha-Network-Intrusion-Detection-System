import { AlertTriangle } from 'lucide-react';

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-64 text-center">
      <AlertTriangle className="h-8 w-8 text-secondary-container" strokeWidth={2} />
      <p className="font-body-md text-[14px] text-on-surface-variant">{message}</p>
    </div>
  );
}
