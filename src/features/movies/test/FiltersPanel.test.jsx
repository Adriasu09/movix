import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

// FiltersPanel renderiza GenreFilter, que usa useGenres → mockeamos el hook.
vi.mock('@/shared/hooks/useGenres', () => ({
  useGenres: () => ({
    data: [
      { id: 28, name: 'Acción' },
      { id: 35, name: 'Comedia' },
    ],
    isLoading: false,
  }),
}));

import { FiltersPanel } from '@/features/movies/components/FiltersPanel';
import copy from '@/config/copy.json';

const baseProps = {
  genre: '',
  onGenreChange: () => {},
  sortBy: 'popularity.desc',
  onSortChange: () => {},
  minRating: '0',
  onRatingChange: () => {},
  onClearAll: () => {},
};

describe('FiltersPanel', () => {
  /**
   * Scenario: El botón "Limpiar filtros" dispara onClearAll
   *   Given el panel de filtros renderizado
   *   When el usuario pulsa el botón de limpiar
   *   Then onClearAll se llama una vez
   */
  it('llama a onClearAll al pulsar el botón de limpiar filtros', () => {
    const onClearAll = vi.fn();
    render(<FiltersPanel {...baseProps} onClearAll={onClearAll} />);

    // El botón tiene dos spans (corto/largo) por responsive; getByRole
    // matchea por el texto accesible combinado → usamos regex laxa.
    const resetButton = screen.getByRole('button', {
      name: new RegExp(copy.explore.filters.resetShortLabel, 'i'),
    });
    fireEvent.click(resetButton);

    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});
