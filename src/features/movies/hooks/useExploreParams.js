import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Fuente de verdad para los filtros de exploración.
// Lee los query params de la URL (?q, ?genre, ?sortBy, ?minRating) y expone
// setters para los filtros. Así la URL es compartible y el botón "atrás"
// funciona. El param ?q (texto de búsqueda) se lee aquí, pero quien lo
// escribe es NavbarSearch.
//
// Cada setter preserva el resto de parámetros activos para no perder
// los demás filtros al cambiar solo uno.
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

  const setGenre = useCallback((value) => setParam("genre", value), [setParam]);
  const setSortBy = useCallback((value) => setParam("sortBy", value), [setParam]);
  const setMinRating = useCallback((value) => setParam("minRating", value), [setParam]);

  const clearAll = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { q, genre, sortBy, minRating, setGenre, setSortBy, setMinRating, clearAll };
}
