import { Skeleton } from '@/shared/components/ui/Skeleton';

// Skeleton de la ficha de persona (E2-14): cabecera + bio + filmografía.
// Misma estructura que la página real para evitar layout shift.
export const PersonDetailSkeleton = () => (
  <div className="mx-auto max-w-screen-xl space-y-2xl px-md py-lg lg:px-lg" aria-hidden="true">
    {/* Header */}
    <div className="flex flex-col items-center gap-lg py-lg sm:flex-row sm:items-start">
      <Skeleton className="aspect-[2/3] w-40 shrink-0 rounded-mvx-xl sm:w-48" />
      <div className="flex flex-1 flex-col gap-sm">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-24 rounded-mvx-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
    </div>

    {/* Bio */}
    <div className="space-y-sm">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>

    {/* Filmografía */}
    <div className="space-y-md">
      <Skeleton className="h-4 w-32" />
      <div className="grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-xs">
            <Skeleton className="aspect-[2/3] w-full rounded-mvx-lg" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
