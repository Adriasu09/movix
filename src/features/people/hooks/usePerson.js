import { useQuery } from "@tanstack/react-query";
import { getPersonById, getPersonMovieCredits } from "@/features/people/services/people.service";

// Detalle de una persona (actor/director).
// `retry` evita reintentos en 404 (entidad inexistente): así la página de
// detalle puede redirigir a /404 inmediatamente sin esperar 3 reintentos.
export function usePerson(id) {
  return useQuery({
    queryKey: ["person", id],
    queryFn: ({ signal }) => getPersonById(id, { signal }),
    enabled: !!id,
    retry: (failureCount, error) => error?.status !== 404 && failureCount < 2,
  });
}

// Filmografía de una persona (cast + dirección).
export function usePersonCredits(id) {
  return useQuery({
    queryKey: ["person", id, "credits"],
    queryFn: ({ signal }) => getPersonMovieCredits(id, { signal }),
    enabled: !!id,
  });
}
