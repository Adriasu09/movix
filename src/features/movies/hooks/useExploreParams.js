import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Fuente de verdad única para el estado de exploración.
// Lee y escribe los query params de la URL (?q, ?genre, ?sortBy, ?minRating)
// de forma que la URL sea siempre compartible y el botón "atrás" funcione.
//
// Cada setter preserva el resto de parámetros activos para no perder
// los filtros al cambiar solo la búsqueda, por ejemplo.
export function useExploreParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lecturas con defaults seguros
  const q = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "popularity.desc";
  const minRating = searchParams.get("minRating") ?? "0";

  // Helper interno: actualiza un param preservando el resto
  const setParam = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === "" || value === null || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const setQ = useCallback((value) => setParam("q", value), [setParam]);
  const setGenre = useCallback((value) => setParam("genre", value), [setParam]);
  const setSortBy = useCallback((value) => setParam("sortBy", value), [setParam]);
  const setMinRating = useCallback((value) => setParam("minRating", value), [setParam]);

  // Limpia TODOS los params (q, genre, sortBy, minRating) → vuelve al estado
  // inicial de /explore. Lo usa el botón "Limpiar filtros".
  const clearAll = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { q, genre, sortBy, minRating, setQ, setGenre, setSortBy, setMinRating, clearAll };
}
