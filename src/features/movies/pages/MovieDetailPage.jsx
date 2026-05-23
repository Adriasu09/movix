import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMovieDetail } from "@/features/movies/hooks/useMovies";
import { useMovieCredits } from "@/features/movies/hooks/useMovieCredits";
import { MovieDetailHero } from "@/features/movies/components/MovieDetailHero";
import { MovieDetailInfo } from "@/features/movies/components/MovieDetailInfo";
import { MovieTrailer } from "@/features/movies/components/MovieTrailer";
import { DirectorCard } from "@/features/movies/components/DirectorCard";
import { CastList } from "@/features/movies/components/CastList";
import { MovieDetailSkeleton } from "@/features/movies/components/MovieDetailSkeleton";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { parseApiError } from "@/shared/utils/parseApiError";
import { ROUTES } from "@/config/routesConfig";

export const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: movie, isLoading, isError, error, refetch } = useMovieDetail(id);
  const { data: credits } = useMovieCredits(id);

  useEffect(() => {
    if (error?.status === 404) {
      navigate(ROUTES.notFound, { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) return <MovieDetailSkeleton />;

  // Error no-404 — el 404 ya redirige arriba.
  if (isError && error?.status !== 404) {
    return (
      <div className="mx-auto max-w-screen-xl px-md py-2xl lg:px-lg">
        <ErrorState message={parseApiError(error).message} onRetry={refetch} />
      </div>
    );
  }

  if (!movie) return null;

  // Director — primer miembro del crew con job === "Director".
  const director = credits?.crew?.find((p) => p.job === "Director") || null;

  return (
    <div className="pb-2xl">
      <div className="-mt-14 md:-mt-18">
        <MovieDetailHero movie={movie} />
      </div>

      <div className="mx-auto max-w-screen-xl space-y-2xl px-md pt-xl lg:px-lg">
        <MovieDetailInfo movie={movie} />
        <MovieTrailer movieId={id} />
        <DirectorCard director={director} />
        {credits?.cast && <CastList cast={credits.cast} />}
      </div>
    </div>
  );
};
