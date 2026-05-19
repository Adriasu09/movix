import { env } from "@/config/env";

// Único punto de entrada HTTP a TMDB. Cada service llama aquí; ningún
// componente ni hook llama a fetch directamente (requisito del bootcamp).
// Autentica con el token v4 (Bearer), no con api_key v3.
// Lanza un Error con `.status`; parseApiError lo traduce a mensaje en ES.

const TIMEOUT_MS = 10000;

export async function tmdbFetch(path, { params, signal } = {}) {
  const url = new URL(`${env.TMDB_BASE_URL}${path}`);
  url.searchParams.set("language", "es-ES");
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value != null && value !== "") url.searchParams.set(key, value);
    }
  }

  // Timeout propio + cancelación de TanStack Query (signal) en un solo abort.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) {
    if (signal.aborted) controller.abort();
    else
      signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
  }

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.TMDB_TOKEN}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      const error = new Error(`TMDB ${res.status}`);
      error.status = res.status;
      throw error;
    }

    return res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      const error = new Error("La solicitud se canceló o tardó demasiado.");
      error.status = 408;
      throw error;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
