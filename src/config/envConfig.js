function requerida(nombre) {
  const valor = import.meta.env[nombre];
  if (!valor) {
    throw new Error(
      `Missing environment variable ${nombre}. Copy it from .env.example to .env.local.`
    );
  }
  return valor;
}

export const env = {
  // TMDB — datos públicos. Necesarias desde el día 1.
  TMDB_TOKEN: requerida('VITE_TMDB_TOKEN'),
  TMDB_BASE_URL: requerida('VITE_TMDB_BASE_URL'),
  TMDB_IMAGE_BASE_URL: requerida('VITE_TMDB_IMAGE_BASE_URL'),

  // Clerk — auth (D5 en adelante). Requerida: sin esta clave el ClerkProvider no arranca.
  CLERK_PUBLISHABLE_KEY: requerida('VITE_CLERK_PUBLISHABLE_KEY'),

  // Supabase — datos personales (favoritos/ratings). Vacías hasta D6; opcionales.
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
};
