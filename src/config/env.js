// Lectura única y validada de las variables de entorno (import.meta.env).
// Ningún otro fichero debe leer import.meta.env directamente: todo pasa por aquí.

function requerida(nombre) {
  const valor = import.meta.env[nombre];
  if (!valor) {
    throw new Error(
      `Falta la variable de entorno ${nombre}. Cópiala desde .env.example a .env.local.`
    );
  }
  return valor;
}

export const env = {
  // TMDB — datos públicos. Necesarias desde el día 1.
  TMDB_TOKEN: requerida("VITE_TMDB_TOKEN"),
  TMDB_BASE_URL: requerida("VITE_TMDB_BASE_URL"),

  // Supabase — auth + favoritos. Vacías hasta D6; opcionales por ahora.
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
};
