// Estado vacío genérico para listas/búsquedas sin resultados.
// API mínima:
//  - icon: componente lucide (opcional). Se pasa como referencia, no JSX.
//  - title: encabezado breve (obligatorio).
//  - description: párrafo aclaratorio (opcional).
//  - action: ReactNode opcional (p.ej. <Button>Limpiar filtros</Button>).
export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-md py-2xl text-center">
      {Icon && (
        <div className="bg-bg-muted rounded-mvx-full p-md">
          <Icon aria-hidden="true" className="text-text-muted h-10 w-10" />
        </div>
      )}
      <div className="space-y-xs">
        <h3 className="text-text-primary font-display text-display-xs">{title}</h3>
        {description && <p className="text-text-secondary text-main-sm max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
};
