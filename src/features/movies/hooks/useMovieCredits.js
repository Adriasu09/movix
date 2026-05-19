import { useQuery } from "@tanstack/react-query";
import { getMovieCredits, getMovieVideos } from "@/features/movies/services/movies.service";

// Reparto y equipo técnico de una película.
export function useMovieCredits(id) {
  return useQuery({
    queryKey: ["movie", id, "credits"],
    queryFn: ({ signal }) => getMovieCredits(id, { signal }),
    enabled: !!id,
  });
}

// Vídeos de una película, filtrados a trailers de YouTube.
export function useMovieVideos(id) {
  return useQuery({
    queryKey: ["movie", id, "videos"],
    queryFn: ({ signal }) => getMovieVideos(id, { signal }),
    enabled: !!id,
    select: (videos) => videos.filter((v) => v.type === "Trailer" && v.site === "YouTube"),
  });
}
