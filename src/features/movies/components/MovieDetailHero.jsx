import { Calendar, Clock, Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { FavoriteToggle } from '@/features/favorites/components/FavoriteToggle';
import { RatingInput } from '@/features/favorites/components/RatingInput';
import { useIsFavorite } from '@/features/favorites/hooks/useIsFavorite';
import { useSession } from '@/features/auth/hooks/useSession';
import copy from '@/config/copy.json';
import { formatRuntime } from '@/shared/utils/formatters';

const fill = (template, vars) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), template);

export const MovieDetailHero = ({ movie }) => {
  const runtime = formatRuntime(movie.runtime);
  const { isSignedIn } = useSession();
  const { isFavorite, personalRating } = useIsFavorite(movie.id);

  return (
    <div className="relative w-full">
      <div className="relative h-(--height-detail-mobile) w-full overflow-hidden md:h-(--height-hero-mobile)">
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt={fill(copy.movieDetail.backdropAlt, { title: movie.title })}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="h-full w-full bg-bg-muted" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg-base via-bg-base/70 to-transparent" />
      </div>

      <div className="mx-auto max-w-screen-xl px-md md:px-lg">
        <div className="relative z-10 -mt-2xl flex flex-col gap-lg pb-md sm:flex-row md:-mt-3xl">
          <div className="mx-auto shrink-0 sm:mx-0">
            <div className="hidden w-36 overflow-hidden rounded-mvx-lg border border-border-default shadow-xl sm:w-48 md:block">
              {movie.posterUrlLarge ? (
                <img
                  src={movie.posterUrlLarge}
                  alt={fill(copy.movieDetail.posterAlt, { title: movie.title })}
                  className="aspect-2/3 w-full object-cover"
                />
              ) : (
                <div className="flex aspect-2/3 w-full items-center justify-center bg-bg-muted p-sm text-center text-main-xs text-text-muted">
                  {copy.messages.noPoster}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-end gap-sm pb-xs text-center sm:text-left">
            <h1 className="font-display text-display-md leading-tight text-text-primary sm:text-display-lg md:text-display-xl">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-md text-main-sm text-text-secondary sm:justify-start">
              {movie.releaseYear && (
                <span className="flex items-center gap-xs">
                  <Calendar aria-hidden="true" className="h-4 w-4" />
                  {movie.releaseYear}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-xs">
                  <Clock aria-hidden="true" className="h-4 w-4" />
                  {runtime}
                </span>
              )}
              {movie.rating != null && (
                <span className="flex items-center gap-xs font-semibold text-rating">
                  <Star aria-hidden="true" className="h-4 w-4 fill-current" />
                  {movie.rating}
                  {movie.voteCount > 0 && (
                    <span className="text-main-xs font-normal text-text-muted">
                      (
                      {fill(copy.movieDetail.voteCountLabel, {
                        count: movie.voteCount.toLocaleString('es-ES'),
                      })}
                      )
                    </span>
                  )}
                </span>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-xs sm:justify-start">
                {movie.genres.map((g) => (
                  <Badge key={g.id}>{g.name}</Badge>
                ))}
              </div>
            )}

            {/* Favoritar y puntuar — solo visible si hay sesión */}
            {isSignedIn && (
              <div className="flex flex-col gap-sm pt-xs">
                <FavoriteToggle movie={movie} size="md" />
                <RatingInput
                  key={movie.id}
                  movieId={movie.id}
                  initialRating={personalRating}
                  disabled={!isFavorite}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
