const BASE =
  "inline-flex items-center gap-xs rounded-mvx-full font-main font-medium whitespace-nowrap";

const VARIANTS = {
  "outline-gold":
    "border border-gold-500 bg-transparent text-gold-500 px-md py-xs text-main-xs md:text-main-sm",
};

export const Badge = ({ variant = "outline-gold", className = "", ...props }) => {
  return <span className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />;
};
