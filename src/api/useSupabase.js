import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';
import { createSupabaseClient } from './supabase.client';

/**
 * Devuelve un cliente Supabase autenticado con el JWT del usuario actual.
 *
 * Excepción controlada a CLAUDE.md §11: este hook usa `useAuth` de Clerk directamente
 * porque ES la fachada que evita que el resto del código lo haga. Vive en `src/api/`,
 * no en una feature, para dejar clara su función de capa de infraestructura.
 *
 * Memoizado por userId — si cambia el usuario (logout/login), se recrea el cliente.
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function useSupabase() {
  const { getToken, userId } = useAuth();
  // userId en deps es intencional: al cambiar de cuenta se recrea el cliente con el nuevo token
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => createSupabaseClient(getToken), [getToken, userId]);
}
