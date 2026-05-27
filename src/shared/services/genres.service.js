import { tmdbFetch } from '@/api/tmdb.client';

export async function getMovieGenres({ signal } = {}) {
  const data = await tmdbFetch('/genre/movie/list', { signal });
  return data.genres || [];
}
