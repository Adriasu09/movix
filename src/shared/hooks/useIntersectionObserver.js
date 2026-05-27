import { useEffect, useRef } from 'react';

export function useIntersectionObserver(
  onIntersect,
  { rootMargin = '200px', threshold = 0 } = {},
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
