import { useEffect, useRef } from "react";

// Observa un elemento del DOM y dispara `onIntersect` cuando entra en el
// viewport. Devuelve el `ref` que el consumidor asigna al elemento.
//
//  - options: pasadas tal cual al IntersectionObserver. Por defecto
//    `rootMargin: "200px"` para anticipar el fetch antes de tocar el borde.
//  - enabled: si es `false`, no se observa nada (útil para pausar al
//    final del scroll infinito, sin desmontar el sentinel).
//
// El callback se guarda en una ref para que cambios en su identidad NO
// re-suscriban el observer (patrón recomendado).
export function useIntersectionObserver(
  onIntersect,
  { rootMargin = "200px", threshold = 0 } = {},
  enabled = true
) {
  const ref = useRef(null);
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) callbackRef.current();
      },
      { rootMargin, threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, rootMargin, threshold]);

  return ref;
}
