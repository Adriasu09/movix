import copy from '@/config/copy.json';
import { formatDateEs, formatRuntime } from '@/shared/utils/formatters';
import { MovieTrailer } from './MovieTrailer';
import { useState } from 'react';

export const MovieDetailInfo = ({ movie }) => {
  const [hasTrailer, setHasTrailer] = useState(false);
  const details = [
    {
      key: 'release',
      label: copy.movieDetail.details.releaseDate,
      value: formatDateEs(movie.releaseDate),
    },
    {
      key: 'language',
      label: copy.movieDetail.details.originalLanguage,
      value: movie.originalLanguage ? movie.originalLanguage.toUpperCase() : null,
    },
    {
      key: 'runtime',
      label: copy.movieDetail.details.runtime,
      value: formatRuntime(movie.runtime),
    },
    {
      key: 'country',
      label: copy.movieDetail.details.country,
      value: movie.productionCountries?.[0] || null,
    },
  ].filter((d) => d.value);

  return (
    <section className="space-y-xl">
      <div className="space-y-sm">
        <h2 className="font-display text-display-sm text-text-primary">
          {copy.movieDetail.sections.synopsis}
        </h2>
        <p className="text-main-md leading-relaxed text-text-secondary">
          {movie.overview || copy.messages.noData}
        </p>
      </div>

      <div className="flex gap-lg">
        <div className={`hidden ${hasTrailer ? 'w-2/3 md:block' : ''} `}>
          <MovieTrailer movieId={movie.id} onTrailerLoad={setHasTrailer} />
        </div>

        {details.length > 0 && (
          <div className="space-y-sm">
            <h2 className="hidden font-display text-display-sm text-text-primary md:block">
              {copy.movieDetail.sections.details}
            </h2>
            <dl
              className={`gap-md ${hasTrailer ? 'grid grid-cols-2 sm:grid-cols-4 md:flex md:flex-col' : 'grid grid-cols-2 sm:grid-cols-4'}`}
            >
              {details.map((d) => (
                <div key={d.key} className="space-y-xs">
                  <dt className="text-main-xs tracking-wide text-text-muted uppercase">
                    {d.label}
                  </dt>
                  <dd className="text-main-sm font-medium text-text-primary">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
};
