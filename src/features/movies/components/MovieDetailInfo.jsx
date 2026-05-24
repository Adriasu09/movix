import copy from "@/config/copy.json";
import { formatDateEs, formatRuntime } from "../utils/format";
import { MovieTrailer } from "./MovieTrailer";
import { useState } from "react";

export const MovieDetailInfo = ({ movie }) => {
  const [hasTrailer, setHasTrailer] = useState(false);
  const details = [
    {
      key: "release",
      label: copy.movieDetail.details.releaseDate,
      value: formatDateEs(movie.releaseDate),
    },
    {
      key: "language",
      label: copy.movieDetail.details.originalLanguage,
      value: movie.originalLanguage ? movie.originalLanguage.toUpperCase() : null,
    },
    {
      key: "runtime",
      label: copy.movieDetail.details.runtime,
      value: formatRuntime(movie.runtime),
    },
    {
      key: "country",
      label: copy.movieDetail.details.country,
      value: movie.productionCountries?.[0] || null,
    },
  ].filter((d) => d.value);

  return (
    <section className="space-y-xl">
      <div className="space-y-sm">
        <h2 className="text-text-primary font-display text-display-sm">
          {copy.movieDetail.sections.synopsis}
        </h2>
        <p className="text-text-secondary text-main-md leading-relaxed">
          {movie.overview || copy.messages.noData}
        </p>
      </div>

      <div className="flex gap-lg">
        <div className={`hidden ${hasTrailer ? "md:block w-2/3" : ""} `}>
          <MovieTrailer movieId={movie.id} onTrailerLoad={setHasTrailer} />
        </div>

        {details.length > 0 && (
          <div className="space-y-sm">
            <h2 className="hidden md:block text-text-primary font-display text-display-sm">
              {copy.movieDetail.sections.details}
            </h2>
            <dl
              className={`gap-md ${hasTrailer ? "grid grid-cols-2 sm:grid-cols-4 md:flex md:flex-col" : "grid grid-cols-2 sm:grid-cols-4"}`}
            >
              {details.map((d) => (
                <div key={d.key} className="space-y-xs">
                  <dt className="text-text-muted text-main-xs uppercase tracking-wide">
                    {d.label}
                  </dt>
                  <dd className="text-text-primary text-main-sm font-medium">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
};
