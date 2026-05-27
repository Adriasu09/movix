import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import copy from '@/config/copy.json';

/* ── Mocks ─────────────────────────────────────────────────────────── */

// useNavigate se mockea para capturar las llamadas de redirección.
const { mockNavigate, mockAddFavorite, mockRemoveFavorite } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockAddFavorite: vi.fn(),
  mockRemoveFavorite: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/features/auth/hooks/useSession', () => ({
  useSession: vi.fn(() => ({ isSignedIn: false, user: null })),
}));

vi.mock('@/features/favorites/hooks/useFavorites', () => ({
  useFavorites: vi.fn(() => ({
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    isAdding: false,
    isRemoving: false,
    favorites: [],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    updateRating: vi.fn(),
    isUpdatingRating: false,
  })),
}));

vi.mock('@/features/favorites/hooks/useIsFavorite', () => ({
  useIsFavorite: vi.fn(() => ({ isFavorite: false })),
}));

/* ── Imports del componente y hooks (después de mocks) ─────────────── */
import { useSession } from '@/features/auth/hooks/useSession';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { useIsFavorite } from '@/features/favorites/hooks/useIsFavorite';
import { FavoriteToggle } from '@/features/favorites/components/FavoriteToggle';

/* ── Helpers ────────────────────────────────────────────────────────── */
const movie = { id: 1, title: 'Inception', posterUrl: null, releaseYear: '2010' };

const baseFavoritesHook = {
  addFavorite: mockAddFavorite,
  removeFavorite: mockRemoveFavorite,
  isAdding: false,
  isRemoving: false,
  favorites: [],
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
  updateRating: vi.fn(),
  isUpdatingRating: false,
};

const renderToggle = () =>
  render(
    <MemoryRouter>
      <FavoriteToggle movie={movie} />
    </MemoryRouter>
  );

/* ── Tests ──────────────────────────────────────────────────────────── */
describe('FavoriteToggle', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockAddFavorite.mockClear();
    mockRemoveFavorite.mockClear();
    useSession.mockReturnValue({ isSignedIn: false, user: null });
    useIsFavorite.mockReturnValue({ isFavorite: false });
    useFavorites.mockReturnValue(baseFavoritesHook);
  });

  /**
   * Scenario: Usuario no autenticado hace clic en el botón
   *   Given el usuario no ha iniciado sesión
   *   When hace clic en el botón de favorita
   *   Then es redirigido a la página de inicio de sesión
   *   And addFavorite no es llamado
   */
  it('redirige al login si el usuario no está autenticado', () => {
    renderToggle();
    fireEvent.click(screen.getByRole('button', { name: copy.favorites.addToFavorites }));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockAddFavorite).not.toHaveBeenCalled();
  });

  /**
   * Scenario: Añadir película a favoritas
   *   Given el usuario está autenticado
   *   And la película no está en favoritas
   *   When hace clic en el botón
   *   Then se llama a addFavorite con la película
   *   And no se redirige al login
   */
  it('llama a addFavorite cuando el usuario autenticado pulsa en una película que no es favorita', () => {
    useSession.mockReturnValue({ isSignedIn: true, user: { id: 'user-1' } });
    renderToggle();
    fireEvent.click(screen.getByRole('button', { name: copy.favorites.addToFavorites }));
    expect(mockAddFavorite).toHaveBeenCalledWith(movie);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Scenario: Quitar película de favoritas
   *   Given el usuario está autenticado
   *   And la película SÍ está en favoritas
   *   When hace clic en el botón
   *   Then se llama a removeFavorite con el id de la película
   */
  it('llama a removeFavorite cuando la película ya es favorita', () => {
    useSession.mockReturnValue({ isSignedIn: true, user: { id: 'user-1' } });
    useIsFavorite.mockReturnValue({ isFavorite: true });
    renderToggle();
    fireEvent.click(screen.getByRole('button', { name: copy.favorites.removeFromFavorites }));
    expect(mockRemoveFavorite).toHaveBeenCalledWith(movie.id);
    expect(mockAddFavorite).not.toHaveBeenCalled();
  });

  /**
   * Scenario: Botón deshabilitado durante operación pendiente
   *   Given hay una operación de añadir en curso (isAdding = true)
   *   When se renderiza el botón
   *   Then el botón está deshabilitado
   */
  it('deshabilita el botón mientras hay una operación pendiente', () => {
    useSession.mockReturnValue({ isSignedIn: true, user: { id: 'user-1' } });
    useFavorites.mockReturnValue({ ...baseFavoritesHook, isAdding: true });
    renderToggle();
    expect(screen.getByRole('button', { name: copy.favorites.addToFavorites })).toBeDisabled();
  });

  /**
   * Scenario: El aria-label refleja el estado actual de favorita
   *   Given la película SÍ está en favoritas
   *   When se renderiza el botón
   *   Then el aria-label indica "Quitar de favoritas"
   */
  it('muestra el aria-label correcto según el estado de favorita', () => {
    useIsFavorite.mockReturnValue({ isFavorite: true });
    renderToggle();
    expect(
      screen.getByRole('button', { name: copy.favorites.removeFromFavorites })
    ).toBeInTheDocument();
  });
});
