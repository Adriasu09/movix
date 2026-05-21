import { GenreFilter } from "@/features/movies/components/GenreFilter";
import { SortFilter } from "@/features/movies/components/SortFilter";
import { RatingFilter } from "@/features/movies/components/RatingFilter";

// Panel de filtros que compone género + orden + rating.
// Recibe los valores actuales y los handlers desde ExplorePage vía
// useExploreParams, para mantener la lógica de URL en un solo lugar.
//
// Props:
//   genre / onGenreChange
//   sortBy / onSortChange
//   minRating / onRatingChange
export const FiltersPanel = ({
  genre,
  onGenreChange,
  sortBy,
  onSortChange,
  minRating,
  onRatingChange,
}) => {
  return (
    <section aria-label="Filtros de búsqueda" className="space-y-lg">
      <GenreFilter activeGenre={genre} onChange={onGenreChange} />
      <SortFilter activeSortBy={sortBy} onChange={onSortChange} />
      <RatingFilter activeMinRating={minRating} onChange={onRatingChange} />
    </section>
  );
};
