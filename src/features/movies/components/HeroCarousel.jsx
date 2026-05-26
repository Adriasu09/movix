import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useFeaturedMovies } from '@/features/movies/hooks/useFeaturedMovies';
import { useGenres } from '@/shared/hooks/useGenres';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

const ROTATE_INTERVAL_MS = 7000;

export const HeroCarousel = ({ hidden = false }) => {
  const { data: movies, isLoading } = useFeaturedMovies();
  const { data: genres } = useGenres();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slidesCount = movies?.length ?? 0;

  useEffect(() => {
    if (isPaused || slidesCount < 2) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % slidesCount);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [currentIndex, isPaused, slidesCount]);

  if (hidden) return null;

  if (isLoading || !movies?.length) {
    return (
      <Skeleton
        className="min-h-[60vh] w-full md:min-h-[80vh]"
        aria-label={copy.messages.loading}
      />
    );
  }

  const genreMap = genres ? Object.fromEntries(genres.map((g) => [g.id, g.name])) : {};

  const movie = movies[currentIndex];
  const slideGenres = (movie.genreIds ?? [])
    .map((id) => genreMap[id])
    .filter(Boolean)
    .slice(0, 2);
  const metaText = [...slideGenres, movie.releaseYear].filter(Boolean).join(' · ');

  return (
    <section
      aria-label={copy.explore.featured.title}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[60vh] w-full overflow-hidden md:min-h-[80vh]"
    >
      {movie.backdropUrl ? (
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="absolute inset-0 h-full w-full mask-[linear-gradient(to_top,transparent_0%,black_45%)] object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-bg-muted" />
      )}

      <div className="absolute inset-0 hidden bg-linear-to-r from-bg-base/90 via-bg-base/50 to-transparent md:block" />
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-bg-base/60 to-transparent" />

      <div className="group absolute inset-x-0 bottom-lg flex flex-col gap-sm p-lg md:inset-y-0 md:right-auto md:left-0 md:mt-18 md:max-w-175 md:justify-center md:gap-md md:pl-3xl">
        <p className="flex items-center gap-xs text-main-2xs font-semibold tracking-wider text-gold-500 uppercase md:text-main-xs">
          <TrendingUp className="h-sm w-sm" />#{currentIndex + 1}{' '}
          {copy.explore.featured.trendingPrefix}
        </p>

        <h2 className="font-display text-display-lg text-text-primary md:text-display-xl">
          {movie.title}
        </h2>

        <div className="flex flex-wrap items-center gap-sm">
          {movie.rating != null && (
            <span className="flex items-center gap-xs rounded-mvx-md bg-bg-base/60 px-sm py-xs">
              <Star aria-hidden="true" className="h-3 w-3 fill-current text-rating" />
              <span className="text-main-sm font-bold text-rating">{movie.rating.toFixed(1)}</span>
            </span>
          )}
          {metaText && (
            <span className="text-main-sm text-text-secondary md:text-main-md">{metaText}</span>
          )}
        </div>

        {movie.overview && (
          <p className="line-clamp-2 max-h-0 max-w-prose overflow-hidden text-main-md text-text-secondary opacity-0 transition-all delay-[3s] duration-500 group-hover:max-h-16 group-hover:opacity-100 group-hover:delay-0">
            {movie.overview}
          </p>
        )}

        <div className="mt-sm">
          <Button as={Link} to={ROUTES.movieDetail(movie.id)} variant="primary" size="md">
            {copy.explore.featured.ctaLabel}
          </Button>
        </div>
      </div>

      {slidesCount > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i - 1 + slidesCount) % slidesCount)}
            aria-label={copy.explore.featured.prevSlideAria}
            className={[
              'absolute top-1/2 left-lg z-10 hidden -translate-y-1/2 items-center justify-center rounded-mvx-full bg-bg-base/60 p-sm transition-opacity duration-300 hover:bg-bg-base/90 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none md:flex',
              isPaused ? 'opacity-100' : 'pointer-events-none opacity-0',
            ].join(' ')}
          >
            <ChevronLeft aria-hidden="true" className="h-6 w-6 text-text-primary" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i + 1) % slidesCount)}
            aria-label={copy.explore.featured.nextSlideAria}
            className={[
              'absolute top-1/2 right-lg z-10 hidden -translate-y-1/2 items-center justify-center rounded-mvx-full bg-bg-base/60 p-sm transition-opacity duration-300 hover:bg-bg-base/90 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none md:flex',
              isPaused ? 'opacity-100' : 'pointer-events-none opacity-0',
            ].join(' ')}
          >
            <ChevronRight aria-hidden="true" className="h-6 w-6 text-text-primary" />
          </button>
        </>
      )}

      <ul className="absolute bottom-md left-1/2 flex -translate-x-1/2 items-center gap-xs">
        {movies.map((m, i) => {
          const isActive = i === currentIndex;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={copy.explore.featured.goToSlideAria.replace('{n}', i + 1)}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'rounded-mvx-full transition-all focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base focus-visible:outline-none',
                  isActive ? 'h-1.5 w-6 bg-gold-500' : 'h-1.5 w-1.5 bg-bg-muted',
                ].join(' ')}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};
