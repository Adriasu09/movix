import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import copy from '@/config/copy.json';

const DEFAULT_SORT = 'created_desc';
const VALID_SORTS = copy.favorites.sortOptions.map((o) => o.value);

export function useFavoritesParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawSort = searchParams.get('sortBy');
  const sortBy = VALID_SORTS.includes(rawSort) ? rawSort : DEFAULT_SORT;

  const setSortBy = useCallback(
    (value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === DEFAULT_SORT || !VALID_SORTS.includes(value)) {
          next.delete('sortBy');
        } else {
          next.set('sortBy', value);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  return { sortBy, setSortBy };
}
