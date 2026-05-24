import { Calendar, Clock, Star } from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";
import copy from "@/config/copy.json";
import { formatRuntime } from "../utils/format";

const fill = (template, vars) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), template);

export const MovieDetailHero = ({ movie }) => {
  const runtime = formatRuntime(movie.runtime);

  return (
    <div className="relative w-full">
      <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh]">
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt={fill(copy.movieDetail.backdropAlt, { title: movie.title })}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="bg-bg-muted h-full w-full" />
        )}
        <div className="from-bg-base via-bg-base/70 absolute inset-0 bg-linear-to-t to-transparent" />
      </div>

      <div className="mx-auto max-w-screen-xl px-md lg:px-lg">
        <div className="relative z-10 -mt-2xl flex flex-col gap-lg pb-md sm:flex-row md:-mt-3xl">
          <div className="mx-auto shrink-0 sm:mx-0">
            <div className="hidden md:block border-border-default rounded-mvx-lg w-36 overflow-hidden border shadow-xl sm:w-48">
              {movie.posterUrlLarge ? (
                <img
                  src={movie.posterUrlLarge}
                  alt={fill(copy.movieDetail.posterAlt, { title: movie.title })}
                  className="aspect-2/3 w-full object-cover"
                />
              ) : (
                <div className="bg-bg-muted text-text-muted text-main-xs flex aspect-2/3 w-full items-center justify-center p-sm text-center">
                  {copy.messages.noPoster}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-end gap-sm pb-xs text-center sm:text-left">
            <h1 className="text-text-primary font-display text-display-md sm:text-display-lg md:text-display-xl leading-tight">
              {movie.title}
            </h1>

            <div className="text-text-secondary text-main-sm flex flex-wrap items-center justify-center gap-md sm:justify-start">
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
                <span className="text-rating flex items-center gap-xs font-semibold">
                  <Star aria-hidden="true" className="h-4 w-4 fill-current" />
                  {movie.rating}
                  {movie.voteCount > 0 && (
                    <span className="text-text-muted text-main-xs font-normal">
                      (
                      {fill(copy.movieDetail.voteCountLabel, {
                        count: movie.voteCount.toLocaleString("es-ES"),
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
          </div>
        </div>
      </div>
    </div>
  );
};
