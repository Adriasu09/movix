import { vi } from 'vitest';
import {
  mapTmdbMovieToMovie,
  mapTmdbPaginatedResponse,
} from '@/features/movies/adapters/tmdbMovie.adapter';

// env.js valida en import; lo mockeamos para no depender de .env.local.
vi.mock('@/config/env', () => ({
  env: { TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p' },
}));

/**
 * Scenario: Adaptar una película de TMDB al modelo interno
 *   Given una respuesta de TMDB (posiblemente con campos nulos)
 *   When se pasa por mapTmdbMovieToMovie
 *   Then se obtiene un objeto con todos los campos y defaults seguros
 */
describe('mapTmdbMovieToMovie', () => {
  it('devuelve todos los campos con defaults aunque el input esté vacío', () => {
    const movie = mapTmdbMovieToMovie({});

    expect(movie).toMatchObject({
      title: 'Título desconocido',
      overview: '',
      releaseDate: null,
      releaseYear: null,
      rating: null,
      voteCount: 0,
      popularity: 0,
      posterUrl: '',
      genreIds: [],
      genres: [],
      adult: false,
    });
  });

  it('sin poster_path deja posterUrl vacío', () => {
    expect(mapTmdbMovieToMovie({ id: 1 }).posterUrl).toBe('');
  });

  it('con poster_path construye la URL de imagen', () => {
    const movie = mapTmdbMovieToMovie({ id: 1, poster_path: '/abc.jpg' });
    expect(movie.posterUrl).toBe('https://image.tmdb.org/t/p/w342/abc.jpg');
  });
});

/**
 * Scenario: Adaptar una respuesta paginada de TMDB
 *   Given una respuesta con results y metadatos de paginación
 *   When se pasa por mapTmdbPaginatedResponse
 *   Then se mapean los results y se normaliza la paginación
 */
describe('mapTmdbPaginatedResponse', () => {
  it('mapea results y normaliza la paginación', () => {
    const res = mapTmdbPaginatedResponse(
      { page: 2, total_pages: 9, total_results: 170, results: [{ id: 1 }] },
      mapTmdbMovieToMovie
    );

    expect(res).toMatchObject({ page: 2, totalPages: 9, totalResults: 170 });
    expect(res.results).toHaveLength(1);
    expect(res.results[0].id).toBe(1);
  });

  it('con respuesta vacía devuelve defaults', () => {
    expect(mapTmdbPaginatedResponse({}, mapTmdbMovieToMovie)).toEqual({
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    });
  });
});
