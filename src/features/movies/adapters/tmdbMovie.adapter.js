import { getImageUrl, IMAGE_SIZES } from "@/shared/utils/tmdbImage";

// TMDB → modelo interno de película. Desacopla la app del shape de TMDB:
// si TMDB cambia un campo, solo se toca aquí.
// Nota verificada contra la API real:
//  - el detalle (/movie/:id) trae `genres` ([{id,name}]), sin `genre_ids`
//  - el listado (/discover, /search) trae `genre_ids` ([number]), sin `genres`
// Por eso se mapean ambos con defaults.
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
    adult: tmdbMovie.adult || false,
  };
}

// Respuesta paginada de TMDB → modelo interno paginado.
export function mapTmdbPaginatedResponse(response = {}, mapperFn) {
  return {
    results: (response.results || []).map(mapperFn),
    page: response.page || 1,
    totalPages: response.total_pages || 1,
    totalResults: response.total_results || 0,
  };
}
