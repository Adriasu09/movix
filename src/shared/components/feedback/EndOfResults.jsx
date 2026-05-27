import copy from '@/config/copy.json';

export const EndOfResults = ({ message = copy.messages.endOfResults }) => (
  <p className="text-main-sm text-text-muted">{message}</p>
);
