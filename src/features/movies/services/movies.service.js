import { tmdbFetch } from '@/api/tmdb.client';
import {
  mapTmdbMovieToMovie,
  mapTmdbPaginatedResponse,
  mapTmdbCredits,
  mapTmdbVideos,
} from '@/features/movies/adapters/tmdbMovie.adapter';

// El cliente fija language=es-ES; los services solo pasan filtros.
// Cada función acepta y reenvía { signal } para que TanStack Query aborte.

// Listado principal y scroll infinito (con filtros opcionales).
export async function discoverMovies({
  page = 1,
  genre = '',
  sortBy = 'popularity.desc',
  minRating = '',
  signal,
} = {}) {
  const params = {
    page,
    sort_by: sortBy,
    'vote_count.gte': 50, // descarta películas con muy pocos votos
    ...(genre && { with_genres: genre }),
    ...(minRating && { 'vote_average.gte': minRating }),
  };
  const data = await tmdbFetch('/discover/movie', { params, signal });
  return mapTmdbPaginatedResponse(data, mapTmdbMovieToMovie);
}

// Búsqueda por texto.
export async function searchMovies({ query, page = 1, signal } = {}) {
  if (!query?.trim()) {
    return { results: [], page: 1, totalPages: 0, totalResults: 0 };
  }
  const params = { query: query.trim(), page };
  const data = await tmdbFetch('/search/movie', { params, signal });
  return mapTmdbPaginatedResponse(data, mapTmdbMovieToMovie);
}

// Detalle de una película por ID.
export async function getMovieById(id, { signal } = {}) {
  const data = await tmdbFetch(`/movie/${id}`, { signal });
  return mapTmdbMovieToMovie(data);
}

// Reparto y equipo técnico de una película.
export async function getMovieCredits(id, { signal } = {}) {
  const data = await tmdbFetch(`/movie/${id}/credits`, { signal });
  return mapTmdbCredits(data);
}

// Vídeos (trailers, teasers...) de una película.
export async function getMovieVideos(id, { signal } = {}) {
  const data = await tmdbFetch(`/movie/${id}/videos`, { signal });
  return mapTmdbVideos(data);
}
