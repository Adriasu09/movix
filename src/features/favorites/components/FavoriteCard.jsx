import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ImageOff } from 'lucide-react';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { useFavorites } from '../hooks/useFavorites';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

/**
 * Card de favorita: muestra el snapshot guardado en Supabase (poster_url,
 * title, release_year, personal_rating) y permite eliminar con confirmación.
 *
 * No reutiliza MovieCard porque el layout es diferente:
 * el rating personal es prominente y hay un botón de eliminar.
 *
 * @param {{ favorite: object }} props
 */
export function FavoriteCard({ favorite }) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { removeFavorite, isRemoving } = useFavorites();

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    removeFavorite(favorite.movie_id);
  };

  return (
    <article
      onClick={() => navigate(ROUTES.movieDetail(favorite.movie_id))}
      className="group relative cursor-pointer overflow-hidden rounded-mvx-lg border border-border-default bg-bg-card transition-colors hover:border-gold-500"
    >
      {/* Póster */}
      <div className="relative aspect-2/3 bg-bg-muted">
        {favorite.poster_url ? (
          <img
            src={favorite.poster_url}
            alt={`Póster de ${favorite.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-sm text-text-muted">
            <ImageOff aria-hidden="true" className="h-10 w-10" />
            <span className="px-sm text-center text-main-xs">{copy.messages.noPoster}</span>
          </div>
        )}

        {/* Badge de puntuación personal */}
        {favorite.personal_rating && (
          <span className="absolute bottom-sm left-sm z-10 flex items-center gap-xs rounded-mvx-full bg-bg-overlay px-sm py-xs text-main-xs font-semibold text-rating">
            ★ {favorite.personal_rating}/10
          </span>
        )}

        {/* Botón eliminar */}
        <button
          type="button"
          onClick={handleRemoveClick}
          disabled={isRemoving}
          aria-label={`Eliminar ${favorite.title} de favoritas`}
          className="absolute right-sm top-sm z-10 flex h-8 w-8 items-center justify-center rounded-mvx-full bg-bg-overlay text-text-primary shadow-md transition-colors hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      {/* Modal de confirmación de borrado */}
      <ConfirmDialog
        open={dialogOpen}
        title={copy.favorites.confirmRemoveTitle}
        description={copy.favorites.confirmRemoveDescription.replace('{title}', favorite.title)}
        confirmLabel={copy.favorites.confirmRemoveAction}
        cancelLabel={copy.favorites.cancel}
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
        danger
      />

      {/* Info */}
      <div className="p-sm">
        <h3 className="line-clamp-2 text-main-sm leading-tight text-text-primary transition-colors group-hover:text-gold-500">
          {favorite.title}
        </h3>
        {favorite.release_year && (
          <p className="mt-xs text-main-xs text-text-muted">{favorite.release_year}</p>
        )}
      </div>
    </article>
  );
}
