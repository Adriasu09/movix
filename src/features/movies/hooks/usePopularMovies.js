import { useQuery } from "@tanstack/react-query";
import { discoverMovies } from "@/features/movies/services/movies.service";

// Una sola página de películas populares — pensado para uso decorativo
// (p.ej. pósters de fondo del hero del Welcome). Para scroll infinito en
// /explore usa `useInfiniteMovies`; aquí no necesitamos paginación.
export const usePopularMovies = () => {
  return useQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ signal }) => discoverMovies({ signal }),
  });
};
