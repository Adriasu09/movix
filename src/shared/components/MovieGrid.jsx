import { useGenres } from "@/shared/hooks/useGenres";
import { MovieCard } from "@/shared/components/MovieCard";
import { MovieCardSkeleton } from "@/shared/components/MovieCardSkeleton";

export const MovieGrid = ({ movies = [], isLoading = false, skeletonCount = 12 }) => {
  const { data: genres } = useGenres();
  const genreMap = genres ? Object.fromEntries(genres.map((g) => [g.id, g.name])) : {};

  const showSkeletons = isLoading && movies.length === 0;

  return (
    <ul className="grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {showSkeletons
        ? Array.from({ length: skeletonCount }, (_, i) => <MovieCardSkeleton key={i} />)
        : movies.map((movie) => <MovieCard key={movie.id} movie={movie} genreMap={genreMap} />)}
    </ul>
  );
};
