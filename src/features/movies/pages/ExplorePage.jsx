import { Film } from "lucide-react";
import { useInfiniteMovies } from "@/features/movies/hooks/useMovies";
import { useExploreParams } from "@/features/movies/hooks/useExploreParams";
import { SearchBar } from "@/features/movies/components/SearchBar";
import { FeaturedCarousel } from "@/features/movies/components/FeaturedCarousel";
import { FiltersPanel } from "@/features/movies/components/FiltersPanel";
import { MovieGrid } from "@/features/movies/components/MovieGrid";
import { InfiniteScrollSentinel } from "@/features/movies/components/InfiniteScrollSentinel";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { parseApiError } from "@/shared/utils/parseApiError";
import copy from "@/shared/constants/copy.json";

// Página /explore: búsqueda + carrusel destacadas + filtros + grid infinito.
// El estado de URL (q, genre, sortBy, minRating) es la única fuente de verdad
// para los filtros — no hay useState para esos valores (CLAUDE.md §7).
export const ExplorePage = () => {
  const { q, genre, sortBy, minRating, setQ, setGenre, setSortBy, setMinRating } =
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
    // minRating "0" es el valor UI de "sin filtro"; el servicio lo descarta si vacío
    minRating: minRating === "0" ? "" : minRating,
  });

  // Aplanar páginas en un array simple, deduplicando por id para evitar
  // duplicados ocasionales que devuelve TMDB entre páginas (CLAUDE.md §13).
  const allMovies = data
    ? Array.from(
        new Map(
          data.pages.flatMap((page) => page.results).map((m) => [m.id, m])
        ).values()
      )
    : [];

  const hasSearch = q.trim().length > 0;

  return (
    <main className="mx-auto max-w-screen-xl space-y-xl px-md py-lg lg:px-lg">
      {/* ── Búsqueda ─────────────────────────────────── */}
      <SearchBar value={q} onChange={setQ} />

      {/* ── Destacadas (se oculta con búsqueda activa) ── */}
      <FeaturedCarousel hidden={hasSearch} />

      {/* ── Filtros ──────────────────────────────────── */}
      <FiltersPanel
        genre={genre}
        onGenreChange={setGenre}
        sortBy={sortBy}
        onSortChange={setSortBy}
        minRating={minRating}
        onRatingChange={setMinRating}
      />

      {/* ── Grid + estados de feedback ───────────────── */}
      {isError ? (
        <ErrorState message={parseApiError(error).message} onRetry={refetch} />
      ) : (
        <>
          {/* MovieGrid muestra skeletons si isLoading && movies vacío */}
          <MovieGrid movies={allMovies} isLoading={isLoading} />

          {/* Estado vacío: carga terminada, cero resultados */}
          {!isLoading && allMovies.length === 0 && (
            <EmptyState
              icon={Film}
              title={copy.explore.emptyTitle}
              description={copy.explore.emptyDescription}
            />
          )}

          {/* Sentinel solo cuando ya hay resultados en pantalla */}
          {allMovies.length > 0 && (
            <InfiniteScrollSentinel
              onIntersect={fetchNextPage}
              isFetching={isFetchingNextPage}
              hasNextPage={!!hasNextPage}
            />
          )}
        </>
      )}
    </main>
  );
};
