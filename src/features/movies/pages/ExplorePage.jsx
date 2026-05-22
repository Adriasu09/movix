import { Film } from "lucide-react";
import { useInfiniteMovies } from "@/features/movies/hooks/useMovies";
import { useExploreParams } from "@/features/movies/hooks/useExploreParams";
import { HeroCarousel } from "@/features/movies/components/HeroCarousel";
import { FiltersPanel } from "@/features/movies/components/FiltersPanel";
import { MovieGrid } from "@/features/movies/components/MovieGrid";
import { InfiniteScrollSentinel } from "@/features/movies/components/InfiniteScrollSentinel";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { parseApiError } from "@/shared/utils/parseApiError";
import copy from "@/config/copy.json";

// Página /explore: búsqueda + carrusel destacadas + filtros + grid infinito.
// El estado de URL (q, genre, sortBy, minRating) es la única fuente de verdad
// para los filtros — no hay useState para esos valores (CLAUDE.md §7).
export const ExplorePage = () => {
  const { q, genre, sortBy, minRating, setGenre, setSortBy, setMinRating, clearAll } =
    useExploreParams();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteMovies({
    query: q,
    genre,
    sortBy,
    minRating: minRating === "0" ? "" : minRating,
  });

  const allMovies = data
    ? Array.from(new Map(data.pages.flatMap((page) => page.results).map((m) => [m.id, m])).values())
    : [];

  const hasSearch = q.trim().length > 0;

  return (
    <div>
      {/* Carrusel full-bleed: cancela el pt-14/md:pt-18 del main para quedar detrás de la navbar */}
      <div className={hasSearch ? undefined : "-mt-14 md:-mt-18"}>
        <HeroCarousel hidden={hasSearch} />
      </div>

      <div className="mx-auto max-w-screen-xl space-y-xl px-md py-lg lg:px-lg">
      <FiltersPanel
        genre={genre}
        onGenreChange={setGenre}
        sortBy={sortBy}
        onSortChange={setSortBy}
        minRating={minRating}
        onRatingChange={setMinRating}
        onClearAll={clearAll}
      />

      {isError ? (
        <ErrorState message={parseApiError(error).message} onRetry={refetch} />
      ) : (
        <>
          <MovieGrid movies={allMovies} isLoading={isLoading} />

          {!isLoading && allMovies.length === 0 && (
            <EmptyState
              icon={Film}
              title={copy.explore.emptyTitle}
              description={copy.explore.emptyDescription}
            />
          )}

          {allMovies.length > 0 && (
            <InfiniteScrollSentinel
              onIntersect={fetchNextPage}
              isFetching={isFetchingNextPage}
              hasNextPage={!!hasNextPage}
            />
          )}
        </>
      )}
      </div>
    </div>
  );
};
