'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-on-surface">
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-on-surface">
          <div className="flex max-w-md flex-col items-center space-y-4 text-center">
            <h2 className="font-headline-md text-[24px] font-bold text-secondary-container">
              Fatal Application Error
            </h2>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              The application encountered a fatal error and could not render the root layout.
            </p>
            <button
              onClick={() => reset()}
              className="rounded bg-primary-fixed-dim/20 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-primary-fixed-dim transition-colors hover:bg-primary-fixed-dim/30"
            >
              Force Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
