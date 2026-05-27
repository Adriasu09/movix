import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import { useExploreParams } from '@/features/movies/hooks/useExploreParams';

// Wrapper con MemoryRouter para que useSearchParams funcione en renderHook.
// initialEntries permite simular la URL inicial con sus query params.
const createWrapper = (initialEntries = ['/explore']) => {
  return ({ children }) =>
    createElement(MemoryRouter, { initialEntries }, children);
};

describe('useExploreParams', () => {
  /**
   * Scenario: Leer los filtros desde la URL con defaults seguros
   *   Given la URL no contiene ningún query param
   *   When se inicializa el hook
   *   Then expone defaults seguros (q='', genre='', sortBy='popularity.desc', minRating='0')
   */
  it('devuelve defaults seguros cuando la URL no tiene parámetros', () => {
    const { result } = renderHook(() => useExploreParams(), {
      wrapper: createWrapper(['/explore']),
    });

    expect(result.current.q).toBe('');
    expect(result.current.genre).toBe('');
    expect(result.current.sortBy).toBe('popularity.desc');
    expect(result.current.minRating).toBe('0');
  });

  /**
   * Scenario: Leer los filtros activos desde la URL
   *   Given la URL contiene ?q=batman&genre=28&sortBy=vote_average.desc&minRating=8
   *   When se inicializa el hook
   *   Then expone los valores leídos de la URL
   */
  it('lee los query params activos de la URL', () => {
    const { result } = renderHook(() => useExploreParams(), {
      wrapper: createWrapper([
        '/explore?q=batman&genre=28&sortBy=vote_average.desc&minRating=8',
      ]),
    });

    expect(result.current.q).toBe('batman');
    expect(result.current.genre).toBe('28');
    expect(result.current.sortBy).toBe('vote_average.desc');
    expect(result.current.minRating).toBe('8');
  });

  /**
   * Scenario: setGenre preserva el resto de filtros activos
   *   Given la URL ya tiene ?q=batman&minRating=8
   *   When el usuario llama a setGenre('28')
   *   Then el hook expone genre='28' Y mantiene q='batman' y minRating='8'
   */
  it('setGenre preserva los otros filtros activos', () => {
    const { result } = renderHook(() => useExploreParams(), {
      wrapper: createWrapper(['/explore?q=batman&minRating=8']),
    });

    act(() => {
      result.current.setGenre('28');
    });

    expect(result.current.genre).toBe('28');
    expect(result.current.q).toBe('batman');
    expect(result.current.minRating).toBe('8');
  });

  /**
   * Scenario: setGenre con valor vacío borra el parámetro
   *   Given la URL tiene ?genre=28
   *   When el usuario llama a setGenre('')
   *   Then genre vuelve a su default ('') porque se eliminó el param de la URL
   */
  it('setGenre con string vacío borra el parámetro de la URL', () => {
    const { result } = renderHook(() => useExploreParams(), {
      wrapper: createWrapper(['/explore?genre=28']),
    });

    expect(result.current.genre).toBe('28');

    act(() => {
      result.current.setGenre('');
    });

    expect(result.current.genre).toBe('');
  });

  /**
   * Scenario: clearAll vacía todos los filtros
   *   Given la URL tiene múltiples filtros (?q, ?genre, ?sortBy, ?minRating)
   *   When el usuario llama a clearAll()
   *   Then todos los parámetros vuelven a su default
   */
  it('clearAll vacía toda la querystring', () => {
    const { result } = renderHook(() => useExploreParams(), {
      wrapper: createWrapper([
        '/explore?q=star&genre=878&sortBy=vote_average.desc&minRating=7',
      ]),
    });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.q).toBe('');
    expect(result.current.genre).toBe('');
    expect(result.current.sortBy).toBe('popularity.desc');
    expect(result.current.minRating).toBe('0');
  });
});
