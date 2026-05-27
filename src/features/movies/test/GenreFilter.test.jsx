import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

// Mock de useGenres: devolvemos la lista completa de TMDB (es-ES) para
// comprobar que GenreFilter recorta a solo los 7 géneros featured.
vi.mock('@/shared/hooks/useGenres', () => ({
  useGenres: () => ({
    data: [
      { id: 28, name: 'Acción' },
      { id: 12, name: 'Aventura' },
      { id: 16, name: 'Animación' },
      { id: 35, name: 'Comedia' },
      { id: 18, name: 'Drama' },
      { id: 27, name: 'Terror' },
      { id: 99, name: 'Documental' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Ciencia ficción' },
      { id: 53, name: 'Suspense' },
    ],
    isLoading: false,
  }),
}));

import { GenreFilter } from '@/features/movies/components/GenreFilter';

describe('GenreFilter', () => {
  /**
   * Scenario: Solo se muestran los géneros featured
   *   Given useGenres devuelve los 20+ géneros completos de TMDB
   *   When se renderiza GenreFilter
   *   Then aparecen los 7 featured (ej: "Acción") pero NO los demás (ej: "Romance")
   */
  it('muestra solo los géneros featured, no la lista completa', () => {
    render(<GenreFilter activeGenre="" onChange={() => {}} />);

    // Featured presentes
    expect(screen.getByRole('button', { name: 'Acción' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Suspense' })).toBeInTheDocument();
    // No featured ausentes
    expect(screen.queryByRole('button', { name: 'Romance' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Aventura' })).not.toBeInTheDocument();
  });

  /**
   * Scenario: Click en un género notifica su id
   *   Given el chip "Acción" (id 28)
   *   When el usuario lo pulsa
   *   Then onChange se llama con "28"
   */
  it('llama a onChange con el id del género al pulsar un chip', () => {
    const onChange = vi.fn();
    render(<GenreFilter activeGenre="" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Acción' }));
    expect(onChange).toHaveBeenCalledWith('28');
  });
});
