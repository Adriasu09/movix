import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import copy from "@/shared/constants/copy.json";

// Tarjeta de película para el grid de exploración.
// Muestra el póster (o fallback), el rating en badge superior derecho,
// y el título + año en la franja inferior.
// El elemento raíz es un <Link> para que toda la card sea clickable.
export const MovieCard = ({ movie }) => {
  // El aria-label describe la acción completa a lectores de pantalla.
  const ariaLabel = copy.explore.viewDetailAria.replace("{title}", movie.title);

  return (
    <li>
      <Link
        to={ROUTES.movieDetail(movie.id)}
        aria-label={ariaLabel}
        className="group relative block overflow-hidden rounded-mvx-md bg-bg-card transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      >
        {/* Póster 2:3 */}
        <div className="aspect-[2/3] w-full overflow-hidden">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            // Fallback cuando TMDB no tiene imagen
            <div className="flex h-full w-full items-center justify-center bg-bg-muted px-sm text-center">
              <span className="text-text-muted text-main-xs">{copy.messages.noPoster}</span>
            </div>
          )}
        </div>

        {/* Badge de rating — esquina superior derecha */}
        {movie.rating != null && (
          <div className="absolute top-xs right-xs flex items-center gap-xs rounded-mvx-sm bg-bg-overlay px-xs py-xs">
            <Star aria-hidden="true" className="text-rating h-3 w-3 fill-current" />
            <span className="text-text-primary text-main-2xs font-semibold leading-none">
              {movie.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Franja inferior: título + año */}
        <div className="p-sm">
          <h3 className="text-text-primary text-main-sm line-clamp-2 font-semibold leading-tight">
            {movie.title}
          </h3>
          {movie.releaseYear && (
            <span className="text-text-secondary text-main-xs mt-xs block">
              {movie.releaseYear}
            </span>
          )}
        </div>
      </Link>
    </li>
  );
};
