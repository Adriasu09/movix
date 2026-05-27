import { Loader2 } from 'lucide-react';
import copy from '@/config/copy.json';

export const LoadingState = ({ message = copy.messages.loading }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[40vh] flex-col items-center justify-center gap-md text-text-secondary"
  >
    <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-gold-500" />
    <span className="text-main-sm">{message}</span>
  </div>
);
