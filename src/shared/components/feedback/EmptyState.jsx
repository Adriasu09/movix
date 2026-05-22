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
        {description && <p className="text-text-secondary text-main-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
};
