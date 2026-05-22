import { env } from "@/config/envConfig";

// Tamaños de imagen de TMDB según el uso. Si cambian, se tocan solo aquí.
export const IMAGE_SIZES = {
  poster: {
    small: "w154",
    medium: "w342", // cards del listado
    large: "w500", // ficha detallada
  },
  backdrop: {
    medium: "w780",
    large: "original", // hero de la ficha
  },
  profile: {
    medium: "w185", // cards de actores
    large: "h632",
  },
};

// Construye la URL completa de una imagen de TMDB.
// Devuelve "" si no hay path (la UI usará un placeholder).
export function getImageUrl(path, size = IMAGE_SIZES.poster.medium) {
  if (!path) return "";
  return `${env.TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
