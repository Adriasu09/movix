// Primitivo input del design system. Sin lógica (CLAUDE.md §3); hereda
// todas las props HTML del <input> nativo (value, onChange, placeholder,
// aria-label, etc.). El consumidor compone iconos/decoración por fuera.
const BASE =
  "w-full bg-bg-muted border border-border-default rounded-mvx-md px-md py-sm font-main text-main-md text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:border-gold-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const Input = ({ type = "text", className = "", ...props }) => {
  return <input type={type} className={`${BASE} ${className}`} {...props} />;
};
