import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';

/* ── Mocks ─────────────────────────────────────────────────────────── */
const { mockUpdateRating } = vi.hoisted(() => ({
  mockUpdateRating: vi.fn(),
}));

vi.mock('@/features/favorites/hooks/useFavorites', () => ({
  useFavorites: () => ({
    updateRating: mockUpdateRating,
    isUpdatingRating: false,
    favorites: [],
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    isAdding: false,
    isRemoving: false,
  }),
}));

/* ── Import del componente (después de mocks) ───────────────────────── */
import { RatingInput } from '@/features/favorites/components/RatingInput';

/* ── Tests ──────────────────────────────────────────────────────────── */
describe('RatingInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUpdateRating.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Scenario: Mostrar puntuación inicial
   *   Given initialRating = 7
   *   When se renderiza RatingInput
   *   Then se muestra "7/10"
   */
  it('muestra el badge con la puntuación inicial', () => {
    render(<RatingInput movieId={1} initialRating={7} />);
    expect(screen.getByText('7/10')).toBeInTheDocument();
  });

  /**
   * Scenario: Sin puntuación inicial no se muestra badge
   *   Given initialRating no está definido
   *   When se renderiza RatingInput
   *   Then no se muestra ningún badge de puntuación
   */
  it('no muestra badge de puntuación si initialRating es 0', () => {
    render(<RatingInput movieId={1} initialRating={0} />);
    expect(screen.queryByText(/\/10/)).not.toBeInTheDocument();
  });

  /**
   * Scenario: Clic en estrella actualiza el display
   *   Given initialRating = 3
   *   When el usuario hace clic en la estrella 5
   *   Then el display muestra "5/10"
   */
  it('actualiza el display al hacer clic en una estrella', () => {
    render(<RatingInput movieId={1} initialRating={3} />);
    fireEvent.click(screen.getByRole('button', { name: '5 estrellas' }));
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  /**
   * Scenario: updateRating se llama tras el debounce
   *   Given el usuario hace clic en la estrella 5
   *   When pasan 600 ms
   *   Then updateRating es llamado con { movieId: 1, rating: 5 }
   */
  it('llama a updateRating con el rating correcto tras el debounce', () => {
    render(<RatingInput movieId={1} initialRating={3} />);
    fireEvent.click(screen.getByRole('button', { name: '5 estrellas' }));
    expect(mockUpdateRating).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(mockUpdateRating).toHaveBeenCalledWith({ movieId: 1, rating: 5 });
  });

  /**
   * Scenario: Varios clics rápidos — solo se persiste el último
   *   Given el usuario hace clic en la estrella 3, luego 7 y luego 9
   *   When pasan 600 ms desde el último clic
   *   Then updateRating solo es llamado una vez con rating 9
   */
  it('aplica debounce y solo llama a updateRating una vez tras varios clics rápidos', () => {
    render(<RatingInput movieId={1} initialRating={0} />);
    fireEvent.click(screen.getByRole('button', { name: '3 estrellas' }));
    fireEvent.click(screen.getByRole('button', { name: '7 estrellas' }));
    fireEvent.click(screen.getByRole('button', { name: '9 estrellas' }));
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(mockUpdateRating).toHaveBeenCalledTimes(1);
    expect(mockUpdateRating).toHaveBeenCalledWith({ movieId: 1, rating: 9 });
  });

  /**
   * Scenario: Clic en estrella activa elimina la puntuación
   *   Given initialRating = 5
   *   When el usuario hace clic en la estrella 5 (ya activa)
   *   Then updateRating es llamado con { movieId: 1, rating: null }
   */
  it('borra el rating al hacer clic en la estrella ya activa', () => {
    render(<RatingInput movieId={1} initialRating={5} />);
    fireEvent.click(screen.getByRole('button', { name: '5 estrellas' }));
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(mockUpdateRating).toHaveBeenCalledWith({ movieId: 1, rating: null });
  });

  /**
   * Scenario: Componente deshabilitado no dispara actualización
   *   Given disabled = true
   *   When el usuario intenta hacer clic en una estrella
   *   Then updateRating no es llamado
   */
  it('no llama a updateRating si el componente está deshabilitado', () => {
    render(<RatingInput movieId={1} initialRating={3} disabled />);
    fireEvent.click(screen.getByRole('button', { name: '5 estrellas' }));
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(mockUpdateRating).not.toHaveBeenCalled();
  });
});
