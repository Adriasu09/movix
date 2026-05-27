import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import copy from '@/config/copy.json';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-md py-2xl text-center">
      <div className="rounded-mvx-full bg-error/10 p-md">
        <AlertCircle aria-hidden="true" className="h-10 w-10 text-error" />
      </div>
      <div className="space-y-xs">
        <h3 className="font-display text-display-xs text-text-primary">
          {copy.messages.errorTitle}
        </h3>
        <p className="text-main-sm text-text-secondary">{message ?? copy.messages.error}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {copy.messages.retry}
        </Button>
      )}
    </div>
  );
};
