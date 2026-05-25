import { useQuery } from "@tanstack/react-query";
import { getMovieGenres } from "@/shared/services/genres.service";

// Géneros de película. Cambian muy raramente → no se invalidan nunca.
export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: ({ signal }) => getMovieGenres({ signal }),
    staleTime: Infinity,
  });
}
