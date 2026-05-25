import { tmdbFetch } from "@/api/tmdb.client";
import {
  mapTmdbPersonToPerson,
  mapTmdbPersonCredits,
} from "@/features/people/adapters/tmdbPerson.adapter";

// Detalle de una persona (actor o director) por ID.
export async function getPersonById(id, { signal } = {}) {
  const data = await tmdbFetch(`/person/${id}`, { signal });
  return mapTmdbPersonToPerson(data);
}

// Créditos de cine de una persona: cast (actuaciones) y crew (dirección).
export async function getPersonMovieCredits(id, { signal } = {}) {
  const data = await tmdbFetch(`/person/${id}/movie_credits`, { signal });
  return mapTmdbPersonCredits(data);
}
