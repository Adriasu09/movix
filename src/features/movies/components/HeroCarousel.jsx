import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { useFeaturedMovies } from "@/features/movies/hooks/useFeaturedMovies";
import { useGenres } from "@/features/movies/hooks/useGenres";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ROUTES } from "@/config/routesConfig";
import copy from "@/config/copy.json";

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
        className="w-full min-h-[60vh] md:min-h-[80vh]"
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
  const metaText = [...slideGenres, movie.releaseYear].filter(Boolean).join(" · ");

  return (
    <section
      aria-label={copy.explore.featured.title}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden min-h-[60vh] md:min-h-[80vh]"
    >
  
      {movie.backdropUrl ? (
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover mask-[linear-gradient(to_top,transparent_0%,black_45%)]"
        />
      ) : (
        <div className="bg-bg-muted absolute inset-0" />
      )}

      <div className="absolute inset-0 hidden bg-linear-to-r from-bg-base/90 via-bg-base/50 to-transparent lg:block" />
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-bg-base/60 to-transparent" />

      <div className="group absolute inset-x-0 bottom-lg flex flex-col gap-sm p-lg md:inset-y-0 md:left-0 md:justify-center md:gap-md md:pl-3xl md:mt-18 md:right-auto md:max-w-175">
        <p className="flex items-center gap-xs text-gold-500 text-main-2xs font-semibold uppercase tracking-wider lg:text-main-xs">
          <TrendingUp className="h-sm w-sm"/>#{currentIndex + 1} {copy.explore.featured.trendingPrefix} 
        </p>

        <h2 className="text-text-primary font-display text-display-lg md:text-display-xl">
          {movie.title}
        </h2>

        <div className="flex flex-wrap items-center gap-sm">
          {movie.rating != null && (
            <span className="bg-bg-base/60 rounded-mvx-md flex items-center gap-xs px-sm py-xs">
              <Star aria-hidden="true" className="text-rating h-3 w-3 fill-current" />
              <span className="text-rating text-main-sm font-bold">
                {movie.rating.toFixed(1)}
              </span>
            </span>
          )}
          {metaText && (
            <span className="text-text-secondary text-main-sm md:text-main-md">
              {metaText}
            </span>
          )}
        </div>

        {movie.overview && (
          <p className="line-clamp-2 max-h-0 max-w-prose overflow-hidden text-text-secondary text-main-md opacity-0 transition-all duration-500 delay-[3s] group-hover:max-h-16 group-hover:opacity-100 group-hover:delay-0">
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
              "absolute left-lg top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-mvx-full bg-bg-base/60 p-sm transition-opacity duration-300 hover:bg-bg-base/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 lg:flex",
              isPaused ? "opacity-100" : "pointer-events-none opacity-0",
            ].join(" ")}
          >
            <ChevronLeft aria-hidden="true" className="text-text-primary h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i + 1) % slidesCount)}
            aria-label={copy.explore.featured.nextSlideAria}
            className={[
              "absolute right-lg top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-mvx-full bg-bg-base/60 p-sm transition-opacity duration-300 hover:bg-bg-base/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 lg:flex",
              isPaused ? "opacity-100" : "pointer-events-none opacity-0",
            ].join(" ")}
          >
            <ChevronRight aria-hidden="true" className="text-text-primary h-6 w-6" />
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
                aria-label={copy.explore.featured.goToSlideAria.replace("{n}", i + 1)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "rounded-mvx-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
                  isActive ? "bg-gold-500 h-1.5 w-6" : "bg-bg-muted h-1.5 w-1.5",
                ].join(" ")}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};
