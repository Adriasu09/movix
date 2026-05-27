import { useState, useRef, useCallback, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import copy from '@/config/copy.json';

const DEBOUNCE_MS = 600;

export function RatingInput({ movieId, initialRating, disabled = false }) {
  const [rating, setRating] = useState(initialRating || 0);
  const [hoverValue, setHoverValue] = useState(0);
  const { updateRating, isUpdatingRating } = useFavorites();
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleClick = useCallback(
    (value) => {
      if (disabled) return;
      const nextRating = value === rating ? 0 : value;
      setRating(nextRating);

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        updateRating({ movieId, rating: nextRating || null });
      }, DEBOUNCE_MS);
    },
    [rating, disabled, movieId, updateRating],
  );

  const displayValue = hoverValue || rating;

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex flex-wrap items-center gap-xs">
        <span className="text-main-sm text-text-secondary">{copy.favorites.myRating}:</span>
        <div className="flex" onMouseLeave={() => setHoverValue(0)}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              onMouseEnter={() => !disabled && setHoverValue(value)}
              disabled={disabled || isUpdatingRating}
              aria-label={`${value} ${value === 1 ? 'estrella' : 'estrellas'}`}
              className={`rounded p-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer transition-transform hover:scale-110'
              }`}
            >
              <Star
                aria-hidden="true"
                className={`h-4 w-4 transition-colors ${
                  value <= displayValue ? 'fill-rating text-rating' : 'text-text-muted'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="min-w-[2rem] text-main-sm font-semibold text-text-primary">
            {rating}/10
          </span>
        )}
      </div>
      {disabled && (
        <p className="text-main-xs italic text-text-muted">{copy.favorites.rateMovieHint}</p>
      )}
    </div>
  );
}
