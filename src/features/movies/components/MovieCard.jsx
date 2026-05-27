import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routesConfig';
import { FavoriteToggle } from '@/features/favorites/components/FavoriteToggle';
import { useIsFavorite } from '@/features/favorites/hooks/useIsFavorite';
import copy from '@/config/copy.json';

export const MovieCard = ({ movie, genreMap = {} }) => {
  const ariaLabel = copy.explore.viewDetailAria.replace('{title}', movie.title);
  const genreName = movie.genres?.[0]?.name ?? genreMap[movie.genreIds?.[0]] ?? null;
  const { personalRating } = useIsFavorite(movie.id);

  return (
    <li className="relative">
      <Link
        to={ROUTES.movieDetail(movie.id)}
        aria-label={ariaLabel}
        className="group block rounded-mvx-lg transition-transform duration-200 ease-in-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base focus-visible:outline-none"
      >
        <div className="overflow-hidden rounded-mvx-lg border border-border-default bg-bg-muted transition-colors duration-200 group-hover:border-gold-500">
          <div className="relative aspect-2/3 w-full">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-sm text-center">
                <span className="text-main-xs text-text-muted">{copy.messages.noPoster}</span>
              </div>
            )}
            {personalRating && (
              <span className="absolute right-sm bottom-sm z-10 flex items-center gap-xs rounded-mvx-full bg-bg-overlay px-sm py-xs text-main-xs font-semibold text-rating">
                ★ {personalRating}
              </span>
            )}
          </div>
        </div>

        <div className="mt-sm space-y-xs">
          <h3 className="line-clamp-1 text-main-md leading-6 text-text-primary">{movie.title}</h3>

          <p className="text-main-md leading-6">
            {movie.rating != null && (
              <span className="text-rating">★ {movie.rating.toFixed(1)}</span>
            )}
            {movie.releaseYear && (
              <span className="text-text-muted">
                {movie.rating != null && ' · '}
                {movie.releaseYear}
              </span>
            )}
            {genreName && (
              <span className="hidden text-text-muted md:inline">
                {(movie.rating != null || movie.releaseYear) && ' · '}
                {genreName}
              </span>
            )}
          </p>
        </div>
      </Link>
      <FavoriteToggle movie={movie} size="sm" className="absolute top-sm left-sm z-10" />
    </li>
  );
};
