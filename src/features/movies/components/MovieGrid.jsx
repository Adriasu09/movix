import { MovieCard } from "@/features/movies/components/MovieCard";
import { MovieCardSkeleton } from "@/features/movies/components/MovieCardSkeleton";

// Grid responsive de películas.
// - Si isLoading y no hay películas aún → muestra skeletonCount skeletons.
// - Si hay películas → las muestra (aunque isLoading sea true por siguiente página,
//   el Sentinel gestiona ese estado incremental).
// Props:
//   movies       – array de objetos del modelo interno (mapTmdbMovieToMovie)
//   isLoading    – true durante la carga inicial (no hay datos aún)
//   skeletonCount – número de skeletons a mostrar en carga inicial (default 12)
export const MovieGrid = ({ movies = [], isLoading = false, skeletonCount = 12 }) => {
  const showSkeletons = isLoading && movies.length === 0;

  return (
    <ul className="grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {showSkeletons
        ? Array.from({ length: skeletonCount }, (_, i) => <MovieCardSkeleton key={i} />)
        : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
    </ul>
  );
};
