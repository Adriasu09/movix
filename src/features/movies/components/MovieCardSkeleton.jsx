import { Skeleton } from '@/shared/components/ui/Skeleton';

export const MovieCardSkeleton = () => {
  return (
    <li aria-hidden="true">
      <Skeleton className="aspect-2/3 w-full rounded-mvx-lg" />

      <div className="mt-sm space-y-xs">
        <Skeleton className="h-4 w-full rounded-mvx-sm" />
        <Skeleton className="h-3 w-1/2 rounded-mvx-sm" />
      </div>
    </li>
  );
};
