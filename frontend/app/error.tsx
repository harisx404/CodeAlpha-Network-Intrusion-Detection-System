'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error boundary caught:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-on-surface">
      <div className="flex max-w-md flex-col items-center space-y-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container/15">
          <AlertTriangle className="h-7 w-7 text-secondary-container" />
        </span>
        <h2 className="font-headline-md text-[24px] font-bold text-on-surface">
          Something went wrong
        </h2>
        <p className="font-body-md text-[14px] text-on-surface-variant">
          A critical error occurred while rendering this view. Please try reloading.
        </p>
        <button
          onClick={() => reset()}
          className="rounded bg-primary-fixed-dim/20 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-primary-fixed-dim transition-colors hover:bg-primary-fixed-dim/30"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
