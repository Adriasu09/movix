import { useMovieVideos } from "@/features/movies/hooks/useMovieCredits";
import copy from "@/config/copy.json";

export const MovieTrailer = ({ movieId }) => {
  const { data: trailers = [], isLoading } = useMovieVideos(movieId);

  const trailer = trailers.find((t) => t.official) || trailers[0];

  if (isLoading || !trailer?.key) return null;

  return (
    <section className="space-y-sm">
      <h2 className="text-text-primary font-display text-display-sm">
        {copy.movieDetail.sections.trailer}
      </h2>
      <div className="bg-bg-muted rounded-mvx-lg relative aspect-video w-full overflow-hidden">
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
