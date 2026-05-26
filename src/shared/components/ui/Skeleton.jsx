// Primitivo loader. Caja con animación de pulso al color de `bg-muted`.
// Sin lógica de negocio (CLAUDE.md §3). Las medidas las pone el consumidor
// vía `className` (p.ej. `h-md w-full` o `aspect-[2/3] w-full`).
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-mvx-sm bg-bg-muted ${className}`}
      {...props}
    />
  );
};
