import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  discoverMovies,
  searchMovies,
  getMovieById,
} from "@/features/movies/services/movies.service";

// Scroll infinito del listado. Si hay query usa búsqueda; si no, discover
// con filtros. La queryKey incluye todos los parámetros activos, así
// TanStack Query resetea la paginación al cambiar búsqueda o filtros.
export function useInfiniteMovies({
  query = "",
  genre = "",
  sortBy = "popularity.desc",
  minRating = "",
} = {}) {
  const isSearchMode = query.trim().length > 0;

  return useInfiniteQuery({
    queryKey: ["movies", "infinite", { query, genre, sortBy, minRating }],
    queryFn: ({ pageParam, signal }) =>
      isSearchMode
        ? searchMovies({ query, page: pageParam, signal })
        : discoverMovies({ page: pageParam, genre, sortBy, minRating, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

// Detalle de una película.
export function useMovieDetail(id) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: ({ signal }) => getMovieById(id, { signal }),
    enabled: !!id,
  });
}
