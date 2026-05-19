// Traduce un error (de tmdb.client u otro) a un mensaje en español + status.
// Lo usará la UI (ErrorState) para mostrar algo legible al usuario.
export function parseApiError(error) {
  const status = error?.status ?? 0;

  let message;
  switch (status) {
    case 401:
    case 403:
      message = "No autorizado. Revisa el token de TMDB.";
      break;
    case 404:
      message = "No encontramos lo que buscabas.";
      break;
    case 408:
      message = "La solicitud tardó demasiado. Inténtalo de nuevo.";
      break;
    case 429:
      message = "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.";
      break;
    default:
      if (status >= 500) {
        message = "El servicio de películas no responde. Inténtalo más tarde.";
      } else if (status === 0) {
        message = "Error de conexión. Verifica tu red.";
      } else {
        message = "Algo salió mal. Inténtalo de nuevo.";
      }
  }

  return { message, status };
}
