import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useFeaturedMovies } from "@/features/movies/hooks/useFeaturedMovies";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ROUTES } from "@/shared/constants/routes";
import copy from "@/shared/constants/copy.json";

// Card individual de carrusel — usa backdrop landscape (16:9) en lugar de
// poster para aprovechar el ancho horizontal del carrusel.
// Componente interno: no se exporta fuera de este archivo.
const FeaturedCard = ({ movie }) => {
  const ariaLabel = copy.explore.viewDetailAria.replace("{title}", movie.title);

  return (
    <li className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[32vw]">
      <Link
        to={ROUTES.movieDetail(movie.id)}
        aria-label={ariaLabel}
        className="group relative block aspect-video overflow-hidden rounded-mvx-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      >
        {/* Backdrop landscape */}
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-muted">
            <span className="text-text-muted text-main-xs">{copy.messages.noPoster}</span>
          </div>
        )}

        {/* Overlay gradiente inferior para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-bg-base/30 to-transparent" />

        {/* Info superpuesta en la parte inferior */}
        <div className="absolute right-0 bottom-0 left-0 p-md">
          <h3 className="text-text-primary font-display text-display-xs line-clamp-1">
            {movie.title}
          </h3>
          <div className="mt-xs flex items-center gap-sm">
            {movie.releaseYear && (
              <span className="text-text-secondary text-main-xs">{movie.releaseYear}</span>
            )}
            {movie.rating != null && (
              <span className="flex items-center gap-xs">
                <Star aria-hidden="true" className="text-rating h-3 w-3 fill-current" />
                <span className="text-text-primary text-main-xs font-semibold">
                  {movie.rating.toFixed(1)}
                </span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

// Esqueleto de FeaturedCard durante la carga inicial
const FeaturedCardSkeleton = () => (
  <li className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[32vw]">
    <Skeleton className="aspect-video w-full rounded-mvx-lg" />
  </li>
);

// Carrusel horizontal scroll-snap con las 3 películas más populares.
// Se oculta cuando hay una búsqueda activa (prop `hidden`).
// Usa CSS scroll-snap nativo (mobile-first, sin librería).
//
// Props:
//   hidden – si es true, no se renderiza (cuando hay búsqueda activa)
export const FeaturedCarousel = ({ hidden = false }) => {
  const { data: movies, isLoading } = useFeaturedMovies();

  if (hidden) return null;

  return (
    <section aria-label={copy.explore.featured.title}>
      <h2 className="text-text-primary font-display text-display-sm mb-md">
        {copy.explore.featured.title}
      </h2>
      {/* scroll-snap horizontal; ocultar scrollbar en todos los navegadores */}
      <ul className="flex gap-md overflow-x-auto snap-x snap-mandatory pb-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? Array.from({ length: 3 }, (_, i) => <FeaturedCardSkeleton key={i} />)
          : movies?.map((movie) => <FeaturedCard key={movie.id} movie={movie} />)}
      </ul>
    </section>
  );
};
