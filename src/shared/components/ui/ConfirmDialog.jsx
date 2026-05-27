import { useEffect } from 'react';
import { Button } from './Button';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  danger = false,
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md"
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative z-10 w-full max-w-125 rounded-mvx-xl border border-border-default bg-bg-card p-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="font-display text-display-sm text-text-primary">
          {title}
        </h2>

        {description && <p className="mt-sm text-main-sm text-text-secondary">{description}</p>}

        <div className="mt-lg flex justify-end gap-sm">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center justify-center rounded-mvx-md px-md py-xs text-main-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card focus-visible:outline-none ${
              danger
                ? 'bg-error text-white hover:opacity-80 focus-visible:ring-error'
                : 'bg-gold-500 text-text-inverted hover:bg-gold-400 focus-visible:ring-gold-500'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
