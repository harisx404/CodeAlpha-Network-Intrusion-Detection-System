'use client';

import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Themed confirmation modal used in place of the native window.confirm().
 * Controlled by the parent through the `open` flag.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="glass-panel w-full max-w-md rounded-lg border border-outline-variant/40 p-6">
        <div className="flex items-start gap-3">
          {destructive && (
            <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary-container/15">
              <AlertTriangle className="h-5 w-5 text-secondary-container" />
            </span>
          )}
          <div className="flex-1">
            <h3
              id="confirm-dialog-title"
              className="font-headline-sm text-[18px] font-semibold text-on-surface"
            >
              {title}
            </h3>
            <p className="mt-2 font-body-md text-[14px] text-on-surface-variant">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded border border-outline-variant/50 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={
              destructive
                ? 'rounded bg-secondary-container/20 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-secondary-container transition-colors hover:bg-secondary-container/30'
                : 'rounded bg-primary-fixed-dim/20 px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-widest text-primary-fixed-dim transition-colors hover:bg-primary-fixed-dim/30'
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
