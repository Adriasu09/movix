import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { vi } from 'vitest';

/* ── Mocks ─────────────────────────────────────────────────────────── */
const mockDiscoverMovies = vi.fn();
const mockSearchMovies = vi.fn();
const mockGetMovieById = vi.fn();

vi.mock('@/features/movies/services/movies.service', () => ({
  discoverMovies: (...args) => mockDiscoverMovies(...args),
  searchMovies: (...args) => mockSearchMovies(...args),
  getMovieById: (...args) => mockGetMovieById(...args),
}));

/* ── Import del hook (después de mocks) ─────────────────────────────── */
import { useInfiniteMovies } from '@/features/movies/hooks/useMovies';

/* ── Helpers ────────────────────────────────────────────────────────── */
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }) => createElement(QueryClientProvider, { client: queryClient }, children);
};

const page = (n, totalPages, results = []) => ({
  page: n,
  totalPages,
  totalResults: totalPages * 20,
  results,
});

/* ── Tests ──────────────────────────────────────────────────────────── */
describe('useInfiniteMovies', () => {
  beforeEach(() => {
    mockDiscoverMovies.mockReset();
    mockSearchMovies.mockReset();
  });

  /**
   * Scenario: Cargar el listado inicial sin búsqueda llama a discoverMovies
   *   Given el usuario entra en la exploración sin texto de búsqueda
   *   When se inicializa el hook
   *   Then se llama a discoverMovies (no a searchMovies) con los filtros activos
   */
  it('sin query llama a discoverMovies con los filtros', async () => {
    mockDiscoverMovies.mockResolvedValue(page(1, 3, [{ id: 1, title: 'Inception' }]));

    const { result } = renderHook(
      () => useInfiniteMovies({ genre: '28', sortBy: 'popularity.desc' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDiscoverMovies).toHaveBeenCalledTimes(1);
    expect(mockSearchMovies).not.toHaveBeenCalled();
    const callArgs = mockDiscoverMovies.mock.calls[0][0];
    expect(callArgs).toMatchObject({
      page: 1,
      genre: '28',
      sortBy: 'popularity.desc',
    });
  });

  /**
   * Scenario: Buscar películas por texto llama a searchMovies
   *   Given el usuario escribe "batman" en el buscador
   *   When se inicializa el hook con query="batman"
   *   Then se llama a searchMovies (no a discoverMovies) con esa query
   */
  it('con query no vacía llama a searchMovies', async () => {
    mockSearchMovies.mockResolvedValue(page(1, 2, [{ id: 11, title: 'Batman Begins' }]));

    const { result } = renderHook(() => useInfiniteMovies({ query: 'batman' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSearchMovies).toHaveBeenCalledTimes(1);
    expect(mockDiscoverMovies).not.toHaveBeenCalled();
    const callArgs = mockSearchMovies.mock.calls[0][0];
    expect(callArgs).toMatchObject({ query: 'batman', page: 1 });
  });

  /**
   * Scenario: Hay más páginas disponibles para scroll infinito
   *   Given la primera página indica que hay 3 páginas en total
   *   When la query completa
   *   Then hasNextPage es true (getNextPageParam devuelve la página siguiente)
   */
  it('expone hasNextPage=true cuando aún quedan páginas', async () => {
    mockDiscoverMovies.mockResolvedValue(page(1, 3, [{ id: 1, title: 'A' }]));

    const { result } = renderHook(() => useInfiniteMovies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);
  });

  /**
   * Scenario: Fin de resultados — no hay más páginas
   *   Given la primera página devuelta es también la última (page === totalPages)
   *   When la query completa
   *   Then hasNextPage es false (getNextPageParam devuelve undefined)
   *   And el scroll infinito deja de pedir más datos
   */
  it('expone hasNextPage=false cuando es la última página', async () => {
    mockDiscoverMovies.mockResolvedValue(page(1, 1, [{ id: 1, title: 'A' }]));

    const { result } = renderHook(() => useInfiniteMovies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });

  /**
   * Scenario: Cargar página siguiente añade resultados sin reiniciar el listado
   *   Given el usuario ya tiene la página 1 cargada
   *   When llama a fetchNextPage()
   *   Then discoverMovies es llamado con page=2 y los resultados se acumulan
   */
  it('fetchNextPage solicita la página 2 al servicio', async () => {
    mockDiscoverMovies
      .mockResolvedValueOnce(page(1, 3, [{ id: 1, title: 'A' }]))
      .mockResolvedValueOnce(page(2, 3, [{ id: 2, title: 'B' }]));

    const { result } = renderHook(() => useInfiniteMovies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => expect(mockDiscoverMovies).toHaveBeenCalledTimes(2));
    expect(mockDiscoverMovies.mock.calls[1][0]).toMatchObject({ page: 2 });
  });
});
