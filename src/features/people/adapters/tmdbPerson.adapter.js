import { getImageUrl, IMAGE_SIZES } from "@/shared/utils/tmdbImage";

// TMDB → modelo interno de persona (actor/director).
// `character`/`order` aparecen cuando viene de un cast; `job`/`department`
// cuando viene de un crew (verificado contra /person/:id/movie_credits).
export function mapTmdbPersonToPerson(tmdbPerson = {}) {
  return {
    id: tmdbPerson.id,
    name: tmdbPerson.name || "Nombre desconocido",
    biography: tmdbPerson.biography || "",
    birthday: tmdbPerson.birthday || null,
    deathday: tmdbPerson.deathday || null,
    placeOfBirth: tmdbPerson.place_of_birth || null,
    profileUrl: getImageUrl(tmdbPerson.profile_path, IMAGE_SIZES.profile.medium),
    popularity: tmdbPerson.popularity || 0,
    knownForDepartment: tmdbPerson.known_for_department || null,
    character: tmdbPerson.character || null,
    order: tmdbPerson.order ?? null,
    job: tmdbPerson.job || null,
    department: tmdbPerson.department || null,
  };
}
