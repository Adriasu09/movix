import { Skeleton } from '@/shared/components/ui/Skeleton';

export function FavoriteCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-mvx-lg border border-border-default">
      <Skeleton className="aspect-2/3 w-full rounded-none" />
      <div className="space-y-xs p-sm">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}
