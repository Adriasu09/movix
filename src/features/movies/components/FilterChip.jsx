export const FilterChip = ({ label, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={[
        "shrink-0 rounded-mvx-full border px-sm py-xs text-main-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
        isActive
          ? "border-gold-500 bg-gold-500 text-text-inverted"
          : "border-border-default bg-transparent text-text-secondary hover:border-border-strong hover:text-text-primary",
      ].join(" ")}
    >
      {label}
    </button>
  );
};
