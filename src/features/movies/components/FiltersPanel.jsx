import { GenreFilter } from '@/features/movies/components/GenreFilter';
import { SortFilter } from '@/features/movies/components/SortFilter';
import { RatingFilter } from '@/features/movies/components/RatingFilter';
import copy from '@/config/copy.json';

export const FiltersPanel = ({
  genre,
  onGenreChange,
  sortBy,
  onSortChange,
  minRating,
  onRatingChange,
  onClearAll,
  disabled = false,
}) => (
  <section
    aria-label="Filtros de búsqueda"
    aria-disabled={disabled}
    className="space-y-md md:space-y-0"
  >
    <div className="md:flex md:items-center md:justify-between md:gap-lg">
      <div className="md:min-w-0 md:flex-1">
        <GenreFilter activeGenre={genre} onChange={onGenreChange} disabled={disabled} />
      </div>

      <div className="flex items-center justify-between md:shrink-0 md:justify-end md:gap-md">
        <div className="flex items-center gap-sm">
          <SortFilter activeSortBy={sortBy} onChange={onSortChange} disabled={disabled} />
          <RatingFilter activeMinRating={minRating} onChange={onRatingChange} disabled={disabled} />
        </div>
        <button
          type="button"
          onClick={onClearAll}
          disabled={disabled}
          className="rounded-mvx-sm text-main-sm font-medium text-gold-500 transition-colors focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none enabled:hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="md:hidden">{copy.explore.filters.resetShortLabel}</span>
          <span className="hidden md:inline">{copy.explore.filters.resetLabel}</span>
        </button>
      </div>
    </div>
  </section>
);
