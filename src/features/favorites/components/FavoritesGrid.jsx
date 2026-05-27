import { FavoriteCard } from './FavoriteCard';

export function FavoritesGrid({ favorites }) {
  return (
    <ul className="grid grid-cols-2 gap-sm sm:grid-cols-3 sm:gap-md md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {favorites.map((favorite) => (
        <li key={favorite.id}>
          <FavoriteCard favorite={favorite} />
        </li>
      ))}
    </ul>
  );
}
