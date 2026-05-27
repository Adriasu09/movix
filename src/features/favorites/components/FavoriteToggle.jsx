import { useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useSession } from '@/features/auth/hooks/useSession';
import { useFavorites } from '../hooks/useFavorites';
import { useIsFavorite } from '../hooks/useIsFavorite';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

const SIZES = {
  sm: { button: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { button: 'h-9 w-9', icon: 'h-5 w-5' },
  lg: { button: 'h-11 w-11', icon: 'h-6 w-6' },
};

export function FavoriteToggle({ movie, size = 'md', className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useSession();
  const { addFavorite, removeFavorite, isAdding, isRemoving } = useFavorites();
  const { isFavorite } = useIsFavorite(movie.id);

  const isPending = isAdding || isRemoving;
  const { button, icon } = SIZES[size] ?? SIZES.md;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    if (!isSignedIn) {
      navigate(`${ROUTES.signIn}?from=${location.pathname}`);
      return;
    }

    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFavorite ? copy.favorites.removeFromFavorites : copy.favorites.addToFavorites}
      aria-pressed={isFavorite}
      className={`flex items-center justify-center rounded-mvx-full bg-bg-overlay shadow-md backdrop-blur-sm transition-opacity hover:opacity-90 ${button} ${className}`}
    >
      <Heart
        aria-hidden="true"
        className={`${icon} transition-colors ${
          isFavorite ? 'fill-error text-error' : 'text-text-primary'
        } ${isPending ? 'animate-pulse' : ''}`}
      />
    </button>
  );
}
