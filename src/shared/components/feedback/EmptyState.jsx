export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-md py-2xl text-center">
      {Icon && (
        <div className="rounded-mvx-full bg-bg-muted p-md">
          <Icon aria-hidden="true" className="h-10 w-10 text-text-muted" />
        </div>
      )}
      <div className="space-y-xs">
        <h3 className="font-display text-display-xs text-text-primary">{title}</h3>
        {description && <p className="text-main-sm text-text-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
};
