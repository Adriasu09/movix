import { Loader2 } from 'lucide-react';
import copy from '@/config/copy.json';

export const InlineSpinner = ({ className = '' }) => (
  <Loader2
    aria-label={copy.messages.loading}
    className={`h-6 w-6 animate-spin text-gold-500 ${className}`}
  />
);
