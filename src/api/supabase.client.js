import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/envConfig';

/**
 * Crea un cliente Supabase autenticado con el JWT de Clerk.
 *
 * Usa la opción nativa `accessToken` del SDK (integración nativa Clerk↔Supabase,
 * reemplaza el patrón antiguo de JWT Template deprecado en abril 2025).
 *
 * El SDK invoca `accessToken()` en cada request, por lo que el token siempre
 * está fresco aunque Clerk lo rote. Por eso se crea uno por sesión, no uno global.
 *
 * @param {() => Promise<string|null>} getToken - getToken() de Clerk (sin template)
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createSupabaseClient(getToken) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    accessToken: async () => (await getToken()) ?? null,
  });
}
