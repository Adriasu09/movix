import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Select } from '@/shared/components/ui/Select';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useFavorites } from '../hooks/useFavorites';
import { FavoritesGrid } from '../components/FavoritesGrid';
import { FavoriteCardSkeleton } from '../components/FavoriteCardSkeleton';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

function sortFavorites(favorites, sortBy) {
  const sorted = [...favorites];
  switch (sortBy) {
    case 'created_asc':
      return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case 'rating_desc':
      return sorted.sort((a, b) => (b.personal_rating || 0) - (a.personal_rating || 0));
    case 'rating_asc':
      return sorted.sort((a, b) => (a.personal_rating || 0) - (b.personal_rating || 0));
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'es'));
    case 'created_desc':
    default:
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('created_desc');
  const { favorites, isLoading, isError, error, refetch } = useFavorites();

  const sortedFavorites = useMemo(
    () => sortFavorites(favorites, sortBy),
    [favorites, sortBy]
  );

  return (
    <section className="mx-auto max-w-7xl px-lg py-2xl">
      <div className="mb-lg flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-display-md text-text-primary">{copy.favorites.title}</h1>
          {favorites.length > 0 && (
            <p className="mt-xs text-main-sm text-text-secondary">
              {favorites.length} {favorites.length === 1 ? 'película guardada' : 'películas guardadas'}
            </p>
          )}
        </div>

        {favorites.length > 0 && (
          <Select
            aria-label={copy.favorites.sortLabel}
            options={copy.favorites.sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        )}
      </div>

      {isLoading && (
        <ul className="grid grid-cols-2 gap-sm sm:grid-cols-3 sm:gap-md md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <FavoriteCardSkeleton />
            </li>
          ))}
        </ul>
      )}

      {isError && (
        <ErrorState message={error?.message} onRetry={refetch} />
      )}

      {!isLoading && !isError && favorites.length === 0 && (
        <EmptyState
          icon={Heart}
          title={copy.favorites.noFavoritesTitle}
          description={copy.favorites.noFavoritesDescription}
          action={
            <Button variant="outline" size="md" onClick={() => navigate(ROUTES.explore)}>
              {copy.favorites.exploreCta}
            </Button>
          }
        />
      )}

      {!isLoading && !isError && sortedFavorites.length > 0 && (
        <FavoritesGrid favorites={sortedFavorites} />
      )}
    </section>
  );
};
