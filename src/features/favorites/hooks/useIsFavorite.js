import { useFavorites } from './useFavorites';

/**
 * Devuelve si una película concreta está en favoritas y su rating personal.
 *
 * Es un hook derivado: lee del cache de useFavorites sin hacer ninguna request adicional.
 * Esto permite usarlo en N MovieCards sin generar N queries a Supabase — solo hay una.
 *
 * @param {number} movieId
 * @returns {{ isFavorite: boolean, personalRating: number|null, favorite: object|null }}
 */
export function useIsFavorite(movieId) {
  const { favorites } = useFavorites();
  const favorite = favorites.find((f) => f.movie_id === Number(movieId));

  return {
    isFavorite: !!favorite,
    personalRating: favorite?.personal_rating ?? null,
    favorite: favorite ?? null,
  };
}
