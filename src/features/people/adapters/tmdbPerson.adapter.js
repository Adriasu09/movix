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
    // Versión grande para la cabecera del detalle (PersonDetailHeader).
    profileUrlLarge: getImageUrl(tmdbPerson.profile_path, IMAGE_SIZES.profile.large),
    popularity: tmdbPerson.popularity || 0,
    knownForDepartment: tmdbPerson.known_for_department || null,
    character: tmdbPerson.character || null,
    order: tmdbPerson.order ?? null,
    job: tmdbPerson.job || null,
    department: tmdbPerson.department || null,
  };
}

// Un crédito de /person/:id/movie_credits es una PELÍCULA en la que la
// persona participó (+ su rol). Se mapea aquí, en people, para no importar
// el adapter de movies (aislamiento entre features, CLAUDE.md §3).
function mapPersonCreditMovie(item = {}) {
  return {
    id: item.id,
    title: item.title || item.original_title || "Título desconocido",
    posterUrl: getImageUrl(item.poster_path, IMAGE_SIZES.poster.medium),
    releaseDate: item.release_date || null,
    releaseYear: item.release_date ? item.release_date.slice(0, 4) : null,
    rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
    popularity: item.popularity || 0,
    character: item.character || null, // solo en cast
    job: item.job || null, // solo en crew
    department: item.department || null,
  };
}

// Créditos de una persona → { cast (top 20 por popularidad), crew (solo
// dirección) }, ya ordenados.
export function mapTmdbPersonCredits(credits = {}) {
  const cast = (credits.cast || [])
    .slice()
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 20)
    .map(mapPersonCreditMovie);

  const crew = (credits.crew || [])
    .filter((item) => item.job === "Director")
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .map(mapPersonCreditMovie);

  return { cast, crew };
}
