import { ChevronDown } from 'lucide-react';

const BASE =
  'appearance-none bg-bg-muted border border-border-default rounded-mvx-md ' +
  'pl-md pr-xl py-xs text-text-secondary text-main-sm font-medium ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ' +
  'transition-colors cursor-pointer enabled:hover:border-border-strong ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

export const Select = ({ options = [], className = '', containerClassName = 'inline-block', ...props }) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <select {...props} className={`${BASE} ${className}`}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-sm h-4 w-4 -translate-y-1/2 text-text-secondary"
      />
    </div>
  );
};
