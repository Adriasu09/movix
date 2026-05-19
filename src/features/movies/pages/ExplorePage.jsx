import { useInfiniteMovies } from "@/features/movies/hooks/useMovies";

// Provisional: verificación de la capa de servicios con datos reales de
// TMDB. Sirve de punto de arranque para la UI de exploración del Día 2
// (entonces se sustituye por MovieGrid + estados de feedback).
export const ExplorePage = () => {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } = useInfiniteMovies();

  if (isLoading) return <p className="p-lg">Cargando películas...</p>;
  if (isError) return <p className="p-lg">Error: {error.message}</p>;

  const movies = data.pages.flatMap((page) => page.results);

  return (
    <div className="p-lg">
      <h1 className="font-display text-display-lg text-gold-500 mb-md">
        Explorar ({movies.length})
      </h1>
      <ul className="flex flex-col gap-xs">
        {movies.map((movie) => (
          <li key={movie.id}>
            {movie.title} · {movie.releaseYear ?? "—"} · ⭐ {movie.rating ?? "—"}
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <button
          className="border-border-gold text-gold-500 mt-md rounded-mvx-md border px-md py-xs"
          onClick={() => fetchNextPage()}
        >
          Cargar más
        </button>
      )}
    </div>
  );
};
