import { vi } from 'vitest';

// Igual que movies.service.test.js: mockear env y tmdbFetch ANTES de
// importar el service (el adapter consume env.TMDB_IMAGE_BASE_URL).
vi.mock('@/config/env', () => ({
  env: { TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p' },
}));
vi.mock('@/api/tmdb.client', () => ({ tmdbFetch: vi.fn() }));

import { tmdbFetch } from '@/api/tmdb.client';
import { getPersonById, getPersonMovieCredits } from '@/features/people/services/people.service';

describe('people.service', () => {
  beforeEach(() => {
    tmdbFetch.mockReset();
  });

  /**
   * Scenario: Obtener detalle de una persona por ID
   *   Given el integration service está disponible
   *   When la aplicación pide el detalle de la persona 123
   *   Then se consulta /person/123 y se devuelve el modelo interno normalizado
   */
  it('getPersonById llama a /person/:id y devuelve el modelo adaptado', async () => {
    tmdbFetch.mockResolvedValue({
      id: 123,
      name: 'Christopher Nolan',
      biography: 'Director británico-estadounidense.',
      birthday: '1970-07-30',
      place_of_birth: 'London, England',
      profile_path: '/nolan.jpg',
      known_for_department: 'Directing',
      popularity: 9.2,
    });

    const person = await getPersonById(123);

    const [path, options] = tmdbFetch.mock.calls[0];
    expect(path).toBe('/person/123');
    expect(options).toEqual({ signal: undefined });

    expect(person).toMatchObject({
      id: 123,
      name: 'Christopher Nolan',
      biography: 'Director británico-estadounidense.',
      birthday: '1970-07-30',
      placeOfBirth: 'London, England',
      knownForDepartment: 'Directing',
    });
    // El adapter construye URLs de imagen a partir de profile_path.
    expect(person.profileUrl).toContain('/nolan.jpg');
  });

  /**
   * Scenario: Obtener los créditos de cine de una persona
   *   Given el integration service está disponible
   *   When la aplicación pide los créditos de la persona 123
   *   Then se consulta /person/123/movie_credits y se devuelve cast + crew normalizados
   *   And crew se filtra a Director (no Producer, no Writer, etc.)
   */
  it('getPersonMovieCredits llama a /person/:id/movie_credits y normaliza cast/crew', async () => {
    tmdbFetch.mockResolvedValue({
      cast: [
        { id: 1, title: 'Memento', popularity: 7, character: 'Leonard' },
        { id: 2, title: 'Inception', popularity: 9, character: 'Cobb' },
      ],
      crew: [
        { id: 3, title: 'The Dark Knight', job: 'Director', popularity: 10 },
        { id: 4, title: 'Otra', job: 'Producer', popularity: 5 },
      ],
    });

    const credits = await getPersonMovieCredits(123);

    const [path] = tmdbFetch.mock.calls[0];
    expect(path).toBe('/person/123/movie_credits');

    // Cast ordenado por popularity desc.
    expect(credits.cast.map((c) => c.id)).toEqual([2, 1]);
    // Crew solo incluye Director.
    expect(credits.crew).toHaveLength(1);
    expect(credits.crew[0]).toMatchObject({ id: 3, job: 'Director' });
  });
});
