import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { vi } from 'vitest';

/* ── Mocks ─────────────────────────────────────────────────────────── */
const mockSupabase = {};

vi.mock('@/api/useSupabase', () => ({
  useSupabase: () => mockSupabase,
}));

vi.mock('@/features/auth/hooks/useSession', () => ({
  useSession: () => ({ user: { id: 'user-1' }, isSignedIn: true, isLoading: false }),
}));

const mockGetFavorites = vi.fn();
const mockAddFavorite = vi.fn();
const mockRemoveFavorite = vi.fn();
const mockUpdateRating = vi.fn();

vi.mock('@/features/favorites/services/favorites.service', () => ({
  getFavorites: (...args) => mockGetFavorites(...args),
  addFavorite: (...args) => mockAddFavorite(...args),
  removeFavorite: (...args) => mockRemoveFavorite(...args),
  updateRating: (...args) => mockUpdateRating(...args),
}));

/* ── Import del hook (después de mocks) ─────────────────────────────── */
import { useFavorites } from '@/features/favorites/hooks/useFavorites';

/* ── Helpers ────────────────────────────────────────────────────────── */

// QueryClient fresco por test para evitar contaminación entre tests.
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

const initialFavorite = {
  id: '1',
  user_id: 'user-1',
  movie_id: 1,
  title: 'Inception',
  poster_url: null,
  release_year: 2010,
  personal_rating: null,
  created_at: '2024-01-01T00:00:00Z',
};

const newMovie = { id: 2, title: 'Interstellar', posterUrl: null, releaseYear: '2014' };

/* ── Tests ──────────────────────────────────────────────────────────── */
describe('useFavorites', () => {
  beforeEach(() => {
    mockGetFavorites.mockClear();
    mockAddFavorite.mockClear();
    mockRemoveFavorite.mockClear();
    mockUpdateRating.mockClear();
  });

  /**
   * Scenario: Obtener favoritas del servidor
   *   Given el usuario está autenticado con id "user-1"
   *   When se inicializa el hook
   *   Then llama a getFavorites con el cliente Supabase y el userId
   */
  it('llama a getFavorites con el cliente Supabase y el userId correcto', async () => {
    mockGetFavorites.mockResolvedValue([]);
    const { result } = renderHook(() => useFavorites(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetFavorites).toHaveBeenCalledWith(mockSupabase, 'user-1');
  });

  /**
   * Scenario: Devolver las favoritas del servidor
   *   Given getFavorites resuelve con una favorita
   *   When la query completa
   *   Then el hook expone esa favorita en favorites[]
   */
  it('expone los datos devueltos por getFavorites', async () => {
    mockGetFavorites.mockResolvedValue([initialFavorite]);
    const { result } = renderHook(() => useFavorites(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.favorites).toHaveLength(1));
    expect(result.current.favorites[0].title).toBe('Inception');
  });

  /**
   * Scenario: Optimistic update al añadir favorita
   *   Given la cache tiene 1 favorita
   *   When se llama a addFavorite con una nueva película
   *   Then la cache se actualiza inmediatamente antes de que la Promise resuelva
   */
  it('añade la favorita al cache inmediatamente (optimistic update)', async () => {
    // Primera carga: 1 favorita. Segunda (post-invalidación): 2 favoritas.
    mockGetFavorites
      .mockResolvedValueOnce([initialFavorite])
      .mockResolvedValue([
        initialFavorite,
        { ...initialFavorite, id: '2', movie_id: 2, title: 'Interstellar' },
      ]);
    mockAddFavorite.mockResolvedValue({
      id: '2',
      movie_id: 2,
      title: 'Interstellar',
      created_at: new Date().toISOString(),
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.favorites).toHaveLength(1));

    act(() => {
      result.current.addFavorite(newMovie);
    });

    // El optimistic update añade la película antes de que el server responda.
    await waitFor(() => expect(result.current.favorites).toHaveLength(2));
    expect(result.current.favorites.some((f) => f.movie_id === 2)).toBe(true);
  });

  /**
   * Scenario: Rollback del optimistic update si addFavorite falla
   *   Given la cache tiene 1 favorita
   *   When addFavorite rechaza con un error
   *   Then la cache se restaura al estado previo (1 favorita original)
   */
  it('revierte el optimistic update si addFavorite falla', async () => {
    mockGetFavorites.mockResolvedValue([initialFavorite]);
    mockAddFavorite.mockRejectedValue(new Error('Network error'));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.favorites).toHaveLength(1));

    act(() => {
      result.current.addFavorite(newMovie);
    });

    // Tras el error y el rollback, la cache vuelve al estado original.
    await waitFor(() => expect(result.current.favorites).toHaveLength(1));
    expect(result.current.favorites[0].title).toBe('Inception');
  });

  /**
   * Scenario: Devolver lista vacía cuando el usuario no tiene favoritas
   *   Given getFavorites resuelve con []
   *   When la query completa
   *   Then favorites es un array vacío y isLoading es false
   */
  it('devuelve lista vacía cuando no hay favoritas', async () => {
    mockGetFavorites.mockResolvedValue([]);
    const { result } = renderHook(() => useFavorites(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isError).toBe(false);
  });
});
