import { getImageUrl, IMAGE_SIZES } from "@/shared/utils/tmdbImage";

export function mapTmdbMovieToMovie(tmdbMovie = {}) {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || tmdbMovie.original_title || "Título desconocido",
    overview: tmdbMovie.overview || "",
    releaseDate: tmdbMovie.release_date || null,
    releaseYear: tmdbMovie.release_date ? tmdbMovie.release_date.slice(0, 4) : null,
    rating: tmdbMovie.vote_average ? Math.round(tmdbMovie.vote_average * 10) / 10 : null,
    voteCount: tmdbMovie.vote_count || 0,
    popularity: tmdbMovie.popularity || 0,
    posterUrl: getImageUrl(tmdbMovie.poster_path, IMAGE_SIZES.poster.medium),
    posterUrlLarge: getImageUrl(tmdbMovie.poster_path, IMAGE_SIZES.poster.large),
    backdropUrl: getImageUrl(tmdbMovie.backdrop_path, IMAGE_SIZES.backdrop.large),
    genreIds: tmdbMovie.genre_ids || [],
    genres: tmdbMovie.genres || [],
    runtime: tmdbMovie.runtime || null,
    originalLanguage: tmdbMovie.original_language || null,
    productionCountries: (tmdbMovie.production_countries || []).map((c) => c.name),
    adult: tmdbMovie.adult || false,
  };
}

export function mapTmdbPaginatedResponse(response = {}, mapperFn) {
  return {
    results: (response.results || []).map(mapperFn),
    page: response.page || 1,
    totalPages: response.total_pages || 1,
    totalResults: response.total_results || 0,
  };
}

function mapCreditMember(member = {}) {
  return {
    id: member.id,
    name: member.name || member.original_name || "Nombre desconocido",
    profileUrl: getImageUrl(member.profile_path, IMAGE_SIZES.profile.medium),
    popularity: member.popularity || 0,
    // Solo en cast:
    character: member.character || null,
    order: member.order ?? null,
    // Solo en crew:
    job: member.job || null,
    department: member.department || null,
  };
}

// Créditos de TMDB → { cast, crew } con el modelo interno de miembro.
export function mapTmdbCredits(credits = {}) {
  return {
    cast: (credits.cast || []).map(mapCreditMember),
    crew: (credits.crew || []).map(mapCreditMember),
  };
}

// Vídeo de TMDB (/movie/:id/videos) → modelo interno mínimo.
function mapVideo(video = {}) {
  return {
    id: video.id,
    key: video.key || null,
    site: video.site || null,
    type: video.type || null,
    name: video.name || "",
    official: video.official || false,
  };
}

export function mapTmdbVideos(response = {}) {
  return (response.results || []).map(mapVideo);
}
