import { useQuery } from "@tanstack/react-query";
import { discoverMovies } from "@/features/movies/services/movies.service";

// Carga las 3 películas más populares para el carrusel "Destacadas".
// Usa staleTime largo (10min) porque la sección de destacadas no necesita
// actualizarse con cada visita — cambia poco respecto al resto del grid.
export function useFeaturedMovies() {
  return useQuery({
    queryKey: ["movies", "featured"],
    queryFn: ({ signal }) => discoverMovies({ sortBy: "popularity.desc", page: 1, signal }),
    select: (data) => data.results.slice(0, 3),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}
