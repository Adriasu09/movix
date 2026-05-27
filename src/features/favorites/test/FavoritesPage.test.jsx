import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import copy from '@/config/copy.json';

/* ── Mocks ─────────────────────────────────────────────────────────── */
const { mockSetSortBy, mockRefetch } = vi.hoisted(() => ({
  mockSetSortBy: vi.fn(),
  mockRefetch: vi.fn(),
}));

vi.mock('@/features/favorites/hooks/useFavoritesParams', () => ({
  useFavoritesParams: vi.fn(() => ({ sortBy: 'created_desc', setSortBy: mockSetSortBy })),
}));

vi.mock('@/features/favorites/hooks/useFavorites', () => ({
  useFavorites: vi.fn(() => ({
    favorites: [],
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockRefetch,
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    updateRating: vi.fn(),
    isAdding: false,
    isRemoving: false,
    isUpdatingRating: false,
  })),
}));

vi.mock('@/features/favorites/hooks/useIsFavorite', () => ({
  useIsFavorite: vi.fn(() => ({ isFavorite: false, personalRating: null })),
}));

/* ── Imports del componente (después de mocks) ──────────────────────── */
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { FavoritesPage } from '@/features/favorites/pages/FavoritesPage';

/* ── Helpers ────────────────────────────────────────────────────────── */
const makeFavorite = (id, title, createdAt = '2024-01-01T00:00:00Z') => ({
  id: String(id),
  user_id: 'user-1',
  movie_id: id,
  title,
  poster_url: null,
  release_year: 2020,
  personal_rating: null,
  created_at: createdAt,
});

const baseHook = {
  favorites: [],
  isLoading: false,
  isError: false,
  error: null,
  refetch: mockRefetch,
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  updateRating: vi.fn(),
  isAdding: false,
  isRemoving: false,
  isUpdatingRating: false,
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <FavoritesPage />
    </MemoryRouter>
  );

/* ── Tests ──────────────────────────────────────────────────────────── */
describe('FavoritesPage', () => {
  beforeEach(() => {
    mockSetSortBy.mockClear();
    mockRefetch.mockClear();
    useFavorites.mockReturnValue(baseHook);
  });

  /**
   * Scenario: Mostrar skeletons durante la carga
   *   Given useFavorites devuelve isLoading = true
   *   When se renderiza FavoritesPage
   *   Then se muestran los 8 skeletons de carga
   *   And no se muestra el estado vacío
   */
  it('muestra los skeletons mientras carga y oculta el estado vacío', () => {
    useFavorites.mockReturnValue({ ...baseHook, isLoading: true });
    renderPage();
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
    expect(screen.queryByText(copy.favorites.noFavoritesTitle)).not.toBeInTheDocument();
  });

  /**
   * Scenario: Mostrar estado de error con mensaje en español
   *   Given useFavorites devuelve isError = true con error de Supabase (código 42501)
   *   When se renderiza FavoritesPage
   *   Then se muestra el mensaje de error en español localizado por parseApiError
   *   And no el error crudo en inglés
   */
  it('muestra el mensaje de error en español cuando la query falla', () => {
    useFavorites.mockReturnValue({
      ...baseHook,
      isError: true,
      error: { code: '42501', message: 'permission denied for table favorites' },
    });
    renderPage();
    expect(screen.getByText('No tienes permiso para realizar esta acción.')).toBeInTheDocument();
    expect(screen.queryByText(/permission denied/i)).not.toBeInTheDocument();
  });

  /**
   * Scenario: Mostrar estado vacío cuando no hay favoritas
   *   Given el usuario no tiene favoritas (favorites = [])
   *   When se renderiza FavoritesPage
   *   Then se muestra el título del estado vacío
   */
  it('muestra el estado vacío cuando no hay favoritas', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: copy.favorites.noFavoritesTitle })).toBeInTheDocument();
  });

  /**
   * Scenario: Mostrar lista de favoritas
   *   Given el usuario tiene 2 favoritas
   *   When se renderiza FavoritesPage
   *   Then se muestran los títulos de ambas películas
   */
  it('muestra los títulos de las favoritas', () => {
    useFavorites.mockReturnValue({
      ...baseHook,
      favorites: [
        makeFavorite(1, 'Inception'),
        makeFavorite(2, 'Interstellar', '2024-01-02T00:00:00Z'),
      ],
    });
    renderPage();
    expect(screen.getByRole('heading', { name: /inception/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /interstellar/i, level: 3 })).toBeInTheDocument();
  });

  /**
   * Scenario: El contador muestra el número de favoritas
   *   Given el usuario tiene 2 favoritas
   *   When se renderiza FavoritesPage
   *   Then se muestra "2 películas guardadas"
   */
  it('muestra el contador correcto de películas guardadas', () => {
    useFavorites.mockReturnValue({
      ...baseHook,
      favorites: [makeFavorite(1, 'Inception'), makeFavorite(2, 'Interstellar')],
    });
    renderPage();
    expect(screen.getByText(/2 películas guardadas/i)).toBeInTheDocument();
  });

  /**
   * Scenario: Cambiar el orden llama a setSortBy
   *   Given hay al menos una favorita (para que el Select sea visible)
   *   When el usuario cambia el select de ordenación
   *   Then setSortBy es llamado con el nuevo valor
   */
  it('llama a setSortBy cuando cambia el selector de orden', () => {
    useFavorites.mockReturnValue({
      ...baseHook,
      favorites: [makeFavorite(1, 'Inception')],
    });
    renderPage();
    const select = screen.getByRole('combobox', { name: copy.favorites.sortLabel });
    fireEvent.change(select, { target: { value: 'title_asc' } });
    expect(mockSetSortBy).toHaveBeenCalledWith('title_asc');
  });
});
