const BASE =
  "inline-flex items-center justify-center gap-xs rounded-mvx-md font-main font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS = {
  primary: "bg-gold-500 text-text-inverted hover:bg-gold-400 focus-visible:ring-gold-500",
  outline:
    "border border-gold-500/40 bg-transparent text-gold-500/50 hover:border-gold-500 hover:text-gold-500 focus-visible:ring-gold-500",
};

const SIZES = {
  sm: "px-md py-xs text-main-sm",
  md: "px-lg py-sm text-main-md",
  lg: "px-xl py-md text-main-md",
};

export const Button = ({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
};
