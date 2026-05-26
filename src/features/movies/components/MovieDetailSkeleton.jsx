import { Skeleton } from '@/shared/components/ui/Skeleton';

export const MovieDetailSkeleton = () => (
  <div aria-hidden="true">
    <Skeleton className="h-[50vh] w-full rounded-none md:h-[60vh]" />

    <div className="mx-auto max-w-screen-xl px-md lg:px-lg">
      <div className="-mt-2xl flex flex-col gap-lg pb-md sm:flex-row md:-mt-3xl">
        <Skeleton className="mx-auto aspect-2/3 w-36 shrink-0 rounded-mvx-lg sm:mx-0 sm:w-48" />
        <div className="flex flex-1 flex-col justify-end gap-sm pb-xs">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-xs">
            <Skeleton className="h-6 w-16 rounded-mvx-full" />
            <Skeleton className="h-6 w-16 rounded-mvx-full" />
            <Skeleton className="h-6 w-16 rounded-mvx-full" />
          </div>
        </div>
      </div>

      <div className="space-y-xl pt-xl pb-2xl">
        <div className="space-y-sm">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-md overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-28 shrink-0 space-y-xs">
              <Skeleton className="h-36 w-28 rounded-mvx-lg" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
