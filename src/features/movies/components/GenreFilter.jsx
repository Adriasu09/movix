import { useGenres } from '@/shared/hooks/useGenres';
import { FilterChip } from '@/features/movies/components/FilterChip';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { FEATURED_GENRE_IDS } from '@/features/movies/constants/featuredGenres';
import copy from '@/config/copy.json';

export const GenreFilter = ({ activeGenre = '', onChange, disabled = false }) => {
  const { data: genres, isLoading } = useGenres();

  const featuredGenres = genres
    ? FEATURED_GENRE_IDS.map((id) => genres.find((g) => g.id === id)).filter(Boolean)
    : [];

  return (
    <div
      role="group"
      aria-label={copy.explore.filters.genresTitle}
      className="mb-md flex scrollbar-none items-center gap-xs overflow-x-auto md:mb-0 [&::-webkit-scrollbar]:hidden"
    >
      <FilterChip
        label={copy.explore.filters.allGenres}
        isActive={activeGenre === ''}
        onClick={() => onChange('')}
        disabled={disabled}
      />

      {isLoading
        ? Array.from({ length: FEATURED_GENRE_IDS.length }, (_, i) => (
            <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-mvx-full" />
          ))
        : featuredGenres.map((g) => (
            <FilterChip
              key={g.id}
              label={g.name}
              isActive={activeGenre === String(g.id)}
              onClick={() => onChange(activeGenre === String(g.id) ? '' : String(g.id))}
              disabled={disabled}
            />
          ))}
    </div>
  );
};
