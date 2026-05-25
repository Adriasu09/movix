import { getImageUrl, IMAGE_SIZES } from "@/shared/utils/tmdbImage";

export function mapTmdbPersonToPerson(tmdbPerson = {}) {
  return {
    id: tmdbPerson.id,
    name: tmdbPerson.name || "Nombre desconocido",
    biography: tmdbPerson.biography || "",
    birthday: tmdbPerson.birthday || null,
    deathday: tmdbPerson.deathday || null,
    placeOfBirth: tmdbPerson.place_of_birth || null,
    profileUrl: getImageUrl(tmdbPerson.profile_path, IMAGE_SIZES.profile.medium),
    profileUrlLarge: getImageUrl(tmdbPerson.profile_path, IMAGE_SIZES.profile.large),
    popularity: tmdbPerson.popularity || 0,
    knownForDepartment: tmdbPerson.known_for_department || null,
  };
}

function mapPersonCreditMovie(item = {}) {
  return {
    id: item.id,
    title: item.title || item.original_title || "Título desconocido",
    posterUrl: getImageUrl(item.poster_path, IMAGE_SIZES.poster.medium),
    releaseDate: item.release_date || null,
    releaseYear: item.release_date ? item.release_date.slice(0, 4) : null,
    rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
    popularity: item.popularity || 0,
    genreIds: item.genre_ids || [],
    character: item.character || null, // solo en cast
    job: item.job || null, // solo en crew
    department: item.department || null,
  };
}

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
