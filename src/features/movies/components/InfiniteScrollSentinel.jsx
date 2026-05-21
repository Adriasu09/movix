import { Loader2 } from "lucide-react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import copy from "@/config/copy.json";

// Elemento centinela al final del grid para el scroll infinito.
// Cuando entra en el viewport dispara `onIntersect` (que llama fetchNextPage).
// Muestra un spinner mientras carga la siguiente página, y el mensaje
// "fin de resultados" cuando ya no hay más páginas.
//
// Props:
//   onIntersect – callback que llama fetchNextPage
//   isFetching  – true mientras TanStack Query carga la siguiente página
//   hasNextPage – false cuando se han agotado todas las páginas
export const InfiniteScrollSentinel = ({ onIntersect, isFetching, hasNextPage }) => {
  // El observer solo está activo cuando HAY más páginas y no estamos ya cargando.
  // Esto evita disparos múltiples mientras el fetch está en curso.
  const sentinelRef = useIntersectionObserver(
    onIntersect,
    { rootMargin: "200px" },
    hasNextPage && !isFetching
  );

  return (
    <div ref={sentinelRef} className="flex justify-center py-xl" aria-live="polite">
      {isFetching && (
        <Loader2
          aria-label={copy.messages.loading}
          className="text-gold-500 h-6 w-6 animate-spin"
        />
      )}
      {!hasNextPage && !isFetching && (
        <p className="text-text-muted text-main-sm">{copy.messages.endOfResults}</p>
      )}
    </div>
  );
};
