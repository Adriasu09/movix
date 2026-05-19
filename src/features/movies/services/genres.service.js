import { tmdbFetch } from "@/api/tmdb.client";

// Lista de géneros de película: [{ id, name }] (ya localizados a es-ES por
// el cliente). Cambian muy raramente → el hook usará staleTime: Infinity.
export async function getMovieGenres({ signal } = {}) {
  const data = await tmdbFetch("/genre/movie/list", { signal });
  return data.genres || [];
}
