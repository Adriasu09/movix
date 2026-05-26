import { useQuery } from '@tanstack/react-query';
import { discoverMovies } from '@/features/movies/services/movies.service';

// Top 5 películas más populares para el HeroCarousel (5 slides con dots).
// staleTime largo (10min): la sección hero no necesita actualizarse con
// cada visita; las películas populares cambian poco a corto plazo.
export function useFeaturedMovies() {
  return useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: ({ signal }) => discoverMovies({ sortBy: 'popularity.desc', page: 1, signal }),
    select: (data) => data.results.slice(0, 5),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}
