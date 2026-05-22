// IDs de género de TMDB que mostramos en el filtro de /explore.
// Lista hardcoded para no exponer los 20+ géneros que devuelve TMDB —
// nos quedamos con los más comunes (los que aparecen en el Figma 36-438
// y 36-2). El orden se respeta tal cual en la UI.
//
// Los IDs son estables independientemente del idioma. useGenres pide
// /genre/movie/list en es-ES → nombres ya en español ("Acción", "Suspense"…).
export const FEATURED_GENRE_IDS = [
  28, // Acción
  35, // Comedia
  18, // Drama
  878, // Ciencia ficción
  27, // Terror
  99, // Documental
  53, // Suspense (Thriller en inglés)
];
