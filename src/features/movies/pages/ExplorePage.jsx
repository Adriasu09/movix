import { Film } from 'lucide-react';
import { useInfiniteMovies } from '@/features/movies/hooks/useMovies';
import { useExploreParams } from '@/features/movies/hooks/useExploreParams';
import { HeroCarousel } from '@/features/movies/components/HeroCarousel';
import { FiltersPanel } from '@/features/movies/components/FiltersPanel';
import { MovieGrid } from '@/shared/components/MovieGrid';
import { InfiniteScrollSentinel } from '@/features/movies/components/InfiniteScrollSentinel';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { Button } from '@/shared/components/ui/Button';
import { parseApiError } from '@/shared/utils/parseApiError';
import copy from '@/config/copy.json';

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
    minRating: minRating === '0' ? '' : minRating,
  });

  const allMovies = data
    ? Array.from(new Map(data.pages.flatMap((page) => page.results).map((m) => [m.id, m])).values())
    : [];

  const hasSearch = q.trim().length > 0;

  const hasActiveFilters =
    genre !== '' || sortBy !== 'popularity.desc' || (minRating !== '' && minRating !== '0');

  return (
    <div>
      <div className={hasSearch ? undefined : '-mt-14 md:-mt-18'}>
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
          disabled={hasSearch}
        />

        {isError ? (
          <ErrorState message={parseApiError(error).message} onRetry={refetch} />
        ) : (
          <>
            <MovieGrid movies={allMovies} isLoading={isLoading} />

            {!isLoading && allMovies.length === 0 && (
              <EmptyState
                icon={Film}
                title={hasSearch ? copy.explore.emptySearchTitle : copy.explore.emptyTitle}
                description={
                  hasSearch ? copy.explore.emptySearchDescription : copy.explore.emptyDescription
                }
                action={
                  hasSearch || hasActiveFilters ? (
                    <Button variant="outline" size="sm" onClick={clearAll}>
                      {hasSearch
                        ? copy.explore.emptyClearSearchCta
                        : copy.explore.emptyClearFiltersCta}
                    </Button>
                  ) : null
                }
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
