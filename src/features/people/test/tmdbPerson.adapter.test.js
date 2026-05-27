import { vi } from 'vitest';
import {
  mapTmdbPersonToPerson,
  mapTmdbPersonCredits,
} from '@/features/people/adapters/tmdbPerson.adapter';

vi.mock('@/config/env', () => ({
  env: { TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p' },
}));

/**
 * Scenario: Adaptar una persona de TMDB al modelo interno
 *   Given una respuesta de persona (posiblemente con campos nulos)
 *   When se pasa por mapTmdbPersonToPerson
 *   Then se obtiene un objeto con todos los campos y defaults seguros
 */
describe('mapTmdbPersonToPerson', () => {
  it('devuelve defaults seguros con input vacío', () => {
    expect(mapTmdbPersonToPerson({})).toMatchObject({
      name: 'Nombre desconocido',
      biography: '',
      birthday: null,
      deathday: null,
      placeOfBirth: null,
      profileUrl: '',
      popularity: 0,
    });
  });
});

/**
 * Scenario: Adaptar los créditos de cine de una persona
 *   Given cast y crew de /person/:id/movie_credits
 *   When se pasa por mapTmdbPersonCredits
 *   Then cast se ordena por popularidad (top 20) y crew se filtra a Director
 */
describe('mapTmdbPersonCredits', () => {
  it('ordena el cast por popularidad y filtra crew a Director', () => {
    const { cast, crew } = mapTmdbPersonCredits({
      cast: [
        { id: 1, popularity: 5, character: 'A' },
        { id: 2, popularity: 9, character: 'B' },
      ],
      crew: [
        { id: 3, job: 'Director', popularity: 7 },
        { id: 4, job: 'Producer', popularity: 8 },
      ],
    });

    expect(cast.map((c) => c.id)).toEqual([2, 1]);
    expect(crew).toHaveLength(1);
    expect(crew[0].id).toBe(3);
  });
});
