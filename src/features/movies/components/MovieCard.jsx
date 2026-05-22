import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routesConfig";
import copy from "@/config/copy.json";

export const MovieCard = ({ movie, genreMap = {} }) => {
  const ariaLabel = copy.explore.viewDetailAria.replace("{title}", movie.title);

  const genreName = movie.genres?.[0]?.name ?? genreMap[movie.genreIds?.[0]] ?? null;

  return (
    <li>
      <Link
        to={ROUTES.movieDetail(movie.id)}
        aria-label={ariaLabel}
        className="group block rounded-mvx-lg transition-transform duration-200 ease-in-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      >
        <div className="bg-bg-muted border border-border-default group-hover:border-gold-500 rounded-mvx-lg overflow-hidden transition-colors duration-200">
          <div className="aspect-2/3 w-full">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-sm text-center">
                <span className="text-text-muted text-main-xs">{copy.messages.noPoster}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-sm space-y-xs">
          <h3 className="text-text-primary text-main-md leading-6 line-clamp-1">{movie.title}</h3>

          <p className="text-main-md leading-6">
            {movie.rating != null && (
              <span className="text-rating">★ {movie.rating.toFixed(1)}</span>
            )}
            {movie.releaseYear && (
              <span className="text-text-muted">
                {movie.rating != null && " · "}
                {movie.releaseYear}
              </span>
            )}
            {genreName && (
              <span className="hidden lg:inline text-text-muted">
                {(movie.rating != null || movie.releaseYear) && " · "}
                {genreName}
              </span>
            )}
          </p>
        </div>
      </Link>
    </li>
  );
};
