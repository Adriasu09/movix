import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import copy from "@/shared/constants/copy.json";

// Barra de búsqueda con debounce de 400ms.
// El estado local `inputValue` refleja lo que el usuario está escribiendo;
// el valor debounceado se sincroniza hacia arriba (onChange) solo cuando
// el usuario para. Así el grid no refetch con cada tecla.
//
// Props:
//   value     – valor actual del param ?q en la URL (fuente de verdad)
//   onChange  – callback(newValue) que actualiza la URL
export const SearchBar = ({ value = "", onChange }) => {
  // Estado local para la respuesta inmediata del input al usuario
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 400);

  // Cuando el valor debounceado cambia, notifica al padre
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange?.(debouncedValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // Si la URL cambia desde fuera (navegación atrás, limpiar filtros desde otro
  // componente), resincronizar el input con el valor de la URL.
  // `value` es estado externo (URL), no props React internas — este patrón de
  // sincronización derivada es correcto aquí; el disable es necesario porque la
  // regla no distingue entre props locales y fuentes externas (CLAUDE.md §14).
  useEffect(() => {
    setInputValue(value); // eslint-disable-line react-hooks/set-state-in-effect
  }, [value]);

  const handleClear = () => {
    setInputValue("");
    onChange?.("");
  };

  return (
    <div className="relative w-full">
      {/* Icono de búsqueda — solo decorativo, el input tiene su propio label */}
      <Search
        aria-hidden="true"
        className="text-text-muted absolute top-1/2 left-md h-4 w-4 -translate-y-1/2"
      />

      <Input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={copy.explore.search.placeholder}
        aria-label={copy.explore.search.placeholder}
        // pl-2xl deja espacio al icono izquierdo; pr-2xl al botón clear derecho
        className="pl-2xl pr-2xl"
      />

      {/* Botón clear — solo visible si hay texto */}
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={copy.explore.search.clearAriaLabel}
          className="text-text-muted hover:text-text-primary absolute top-1/2 right-md -translate-y-1/2 transition-colors"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
