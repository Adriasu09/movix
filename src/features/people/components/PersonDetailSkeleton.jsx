import { Skeleton } from "@/shared/components/ui/Skeleton";

// Skeleton de la ficha de persona (E2-14): cabecera + bio + filmografía.
// Misma estructura que la página real para evitar layout shift.
export const PersonDetailSkeleton = () => (
  <div className="mx-auto max-w-screen-xl space-y-2xl px-md py-lg lg:px-lg" aria-hidden="true">
    {/* Header */}
    <div className="gap-lg py-lg flex flex-col items-center sm:flex-row sm:items-start">
      <Skeleton className="rounded-mvx-xl aspect-[2/3] w-40 shrink-0 sm:w-48" />
      <div className="gap-sm flex flex-1 flex-col">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="rounded-mvx-full h-6 w-24" />
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
      <div className="gap-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-xs">
            <Skeleton className="rounded-mvx-lg aspect-[2/3] w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
