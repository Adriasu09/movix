import { useMovieVideos } from '@/features/movies/hooks/useMovieCredits';
import copy from '@/config/copy.json';
import { useEffect } from 'react';

export const MovieTrailer = ({ movieId, onTrailerLoad }) => {
  const { data: trailers = [], isLoading } = useMovieVideos(movieId);

  const trailer = trailers.find((t) => t.official) || trailers[0];

  useEffect(() => {
    if (!isLoading) {
      onTrailerLoad?.(!!trailer?.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, trailer?.key]);

  if (isLoading || !trailer?.key) return null;

  return (
    <section className="space-y-sm">
      <h2 className="font-display text-display-sm text-text-primary">
        {copy.movieDetail.sections.trailer}
      </h2>
      <div className="relative aspect-video w-full overflow-hidden rounded-mvx-lg bg-bg-muted">
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
          title={trailer.name || copy.movieDetail.trailerFallbackTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </section>
  );
};
