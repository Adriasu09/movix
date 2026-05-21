import { useEffect, useState } from "react";

// Devuelve `value` retrasado por `delay` ms.
// Útil para inputs de búsqueda: evita disparar la query con cada tecla
// y solo notifica cuando el usuario para de escribir.
//
// Si `value` o `delay` cambian antes de cumplirse el plazo, el timer se
// cancela y arranca otro nuevo (debounce clásico).
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}
