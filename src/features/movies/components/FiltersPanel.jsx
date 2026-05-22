import { GenreFilter } from "@/features/movies/components/GenreFilter";
import { SortFilter } from "@/features/movies/components/SortFilter";
import { RatingFilter } from "@/features/movies/components/RatingFilter";
import copy from "@/config/copy.json";

export const FiltersPanel = ({
  genre,
  onGenreChange,
  sortBy,
  onSortChange,
  minRating,
  onRatingChange,
  onClearAll,
}) => (
  <section aria-label="Filtros de búsqueda" className="space-y-md md:space-y-0">
    <div className="md:flex md:items-center md:justify-between md:gap-lg">
      <div className="md:min-w-0 md:flex-1">
        <GenreFilter activeGenre={genre} onChange={onGenreChange} />
      </div>

      <div className="flex items-center justify-between gap-md md:shrink-0 md:justify-end">
        <div className="flex items-center gap-sm">
          <SortFilter activeSortBy={sortBy} onChange={onSortChange} />
          <RatingFilter activeMinRating={minRating} onChange={onRatingChange} />
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-gold-500 hover:text-gold-400 rounded-mvx-sm text-main-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        >
          <span className="md:hidden">{copy.explore.filters.resetShortLabel}</span>
          <span className="hidden md:inline">{copy.explore.filters.resetLabel}</span>
        </button>
      </div>
    </div>
  </section>
);
