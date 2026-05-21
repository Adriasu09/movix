import { Skeleton } from "@/shared/components/ui/Skeleton";

// Placeholder animado de MovieCard mientras cargan los datos.
// Mismo aspect-ratio (2:3) y estructura de franja inferior que MovieCard
// para evitar saltos de layout al transicionar de skeleton a card real.
export const MovieCardSkeleton = () => {
  return (
    <li aria-hidden="true">
      <div className="rounded-mvx-md overflow-hidden bg-bg-card">
        {/* Póster skeleton */}
        <Skeleton className="aspect-[2/3] w-full rounded-none" />

        {/* Franja inferior skeleton */}
        <div className="p-sm space-y-xs">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </li>
  );
};
