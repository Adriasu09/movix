import { vi } from 'vitest';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateRating,
} from '@/features/favorites/services/favorites.service';

/* ── Helpers ────────────────────────────────────────────────────────── */

// Stub de Supabase encadenable. Todos los métodos devuelven el mismo
// objeto (chain) excepto el final: `then` resuelve con { data, error }
// configurados por el test. Así `await supabase.from(...).select(...)
// .eq(...).order(...)` funciona idéntico a la API real.
function createSupabaseStub(result = { data: null, error: null }) {
  const chain = {
    from: vi.fn(),
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    single: vi.fn(),
  };
  for (const key of Object.keys(chain)) {
    chain[key].mockReturnValue(chain);
  }
  // PromiseLike: el await final lee este then.
  chain.then = (resolve, reject) =>
    Promise.resolve(result).then(resolve, reject);

  return chain;
}

/* ── Tests ──────────────────────────────────────────────────────────── */
describe('favorites.service', () => {
  /**
   * Scenario: Recuperar el listado personal de favoritas
   *   Given el persistence service está disponible
   *   When la aplicación pide las favoritas del usuario "user-1"
   *   Then se consulta la tabla "favorites" filtrada por user_id
   *   And se ordena por created_at descendente
   */
  it('getFavorites consulta favorites filtrando por user_id y ordenando por created_at desc', async () => {
    const row = {
      id: '1',
      user_id: 'user-1',
      movie_id: 10,
      title: 'Inception',
      created_at: '2024-01-01T00:00:00Z',
    };
    const supabase = createSupabaseStub({ data: [row], error: null });

    const result = await getFavorites(supabase, 'user-1');

    expect(supabase.from).toHaveBeenCalledWith('favorites');
    expect(supabase.select).toHaveBeenCalledWith('*');
    expect(supabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(supabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result).toEqual([row]);
  });

  /**
   * Scenario: getFavorites devuelve [] cuando no hay favoritas
   *   Given Supabase responde con data=null y error=null
   *   When la aplicación pide las favoritas
   *   Then el servicio devuelve un array vacío (no null)
   */
  it('getFavorites devuelve [] cuando Supabase responde con data=null', async () => {
    const supabase = createSupabaseStub({ data: null, error: null });
    const result = await getFavorites(supabase, 'user-1');
    expect(result).toEqual([]);
  });

  /**
   * Scenario: Guardar una película como favorita
   *   Given el persistence service está disponible
   *   When la aplicación inserta una nueva favorita
   *   Then se inserta con user_id, movie_id, title, poster_url y release_year
   */
  it('addFavorite inserta la fila con los campos correctos', async () => {
    const inserted = {
      id: '99',
      user_id: 'user-1',
      movie_id: 42,
      title: 'Interstellar',
      poster_url: 'https://img/p.jpg',
      release_year: '2014',
      personal_rating: null,
    };
    const supabase = createSupabaseStub({ data: inserted, error: null });

    const result = await addFavorite(supabase, {
      userId: 'user-1',
      movie: {
        id: 42,
        title: 'Interstellar',
        posterUrl: 'https://img/p.jpg',
        releaseYear: '2014',
      },
    });

    expect(supabase.from).toHaveBeenCalledWith('favorites');
    expect(supabase.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      movie_id: 42,
      title: 'Interstellar',
      poster_url: 'https://img/p.jpg',
      release_year: '2014',
    });
    expect(result).toEqual(inserted);
  });

  /**
   * Scenario: Eliminar una película de favoritas
   *   Given el persistence service está disponible
   *   When la aplicación elimina la película movie_id=42 del user_id="user-1"
   *   Then se llama a delete filtrando por user_id y movie_id
   */
  it('removeFavorite borra la fila por user_id + movie_id', async () => {
    const supabase = createSupabaseStub({ data: null, error: null });

    await removeFavorite(supabase, { userId: 'user-1', movieId: 42 });

    expect(supabase.from).toHaveBeenCalledWith('favorites');
    expect(supabase.delete).toHaveBeenCalled();
    expect(supabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(supabase.eq).toHaveBeenCalledWith('movie_id', 42);
  });

  /**
   * Scenario: Rechazar una puntuación fuera de rango
   *   Given el usuario intenta asignar una puntuación de 15 (fuera del rango 1-10)
   *   When se llama a updateRating
   *   Then el servicio lanza un error de validación y NO toca Supabase
   */
  it('updateRating rechaza rating fuera de rango (1-10) sin tocar Supabase', async () => {
    const supabase = createSupabaseStub({ data: null, error: null });

    await expect(
      updateRating(supabase, { userId: 'user-1', movieId: 42, rating: 15 })
    ).rejects.toThrow('Rating must be between 1 and 10');

    expect(supabase.from).not.toHaveBeenCalled();
  });

  /**
   * Scenario: Asignar una puntuación personal válida
   *   Given una favorita existente
   *   When el usuario asigna rating=7
   *   Then se actualiza el campo personal_rating en Supabase
   */
  it('updateRating con rating válido actualiza personal_rating', async () => {
    const updated = {
      id: '1',
      user_id: 'user-1',
      movie_id: 42,
      personal_rating: 7,
    };
    const supabase = createSupabaseStub({ data: updated, error: null });

    const result = await updateRating(supabase, {
      userId: 'user-1',
      movieId: 42,
      rating: 7,
    });

    expect(supabase.update).toHaveBeenCalledWith({ personal_rating: 7 });
    expect(supabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(supabase.eq).toHaveBeenCalledWith('movie_id', 42);
    expect(result).toEqual(updated);
  });

  /**
   * Scenario: Propagar el error si Supabase falla
   *   Given Supabase responde con un error
   *   When la aplicación pide las favoritas
   *   Then el servicio lanza el error (no lo silencia)
   */
  it('getFavorites lanza el error si Supabase responde con error', async () => {
    const dbError = { code: '42501', message: 'permission denied' };
    const supabase = createSupabaseStub({ data: null, error: dbError });

    await expect(getFavorites(supabase, 'user-1')).rejects.toBe(dbError);
  });
});
