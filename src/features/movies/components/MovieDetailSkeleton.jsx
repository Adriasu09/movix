import { Skeleton } from "@/shared/components/ui/Skeleton";

// Skeleton de la ficha de película (E2-14). Misma estructura que el hero +
// info + reparto para evitar layout shift al pasar a contenido real.
export const MovieDetailSkeleton = () => (
  <div aria-hidden="true">
    {/* Hero */}
    <Skeleton className="h-[50vh] w-full rounded-none md:h-[60vh]" />

    <div className="mx-auto max-w-screen-xl px-md lg:px-lg">
      <div className="gap-lg pb-md -mt-2xl md:-mt-3xl flex flex-col sm:flex-row">
        <Skeleton className="rounded-mvx-lg mx-auto aspect-[2/3] w-36 shrink-0 sm:mx-0 sm:w-48" />
        <div className="gap-sm pb-xs flex flex-1 flex-col justify-end">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="gap-xs flex">
            <Skeleton className="rounded-mvx-full h-6 w-16" />
            <Skeleton className="rounded-mvx-full h-6 w-16" />
            <Skeleton className="rounded-mvx-full h-6 w-16" />
          </div>
        </div>
      </div>

      <div className="space-y-xl pt-xl pb-2xl">
        {/* Sinopsis */}
        <div className="space-y-sm">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {/* Reparto */}
        <div className="gap-md flex overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-xs w-28 shrink-0">
              <Skeleton className="rounded-mvx-lg h-36 w-28" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
