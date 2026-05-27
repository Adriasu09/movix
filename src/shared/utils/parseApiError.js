function parseSupabaseError(error) {
  const code = error.code;
  let message;
  switch (code) {
    case '23505':
      message = 'Este elemento ya existe en tu lista.';
      break;
    case '42501':
      message = 'No tienes permiso para realizar esta acción.';
      break;
    case '23503':
    case '23502':
    case '22P02':
      message = 'Datos inválidos. Inténtalo de nuevo.';
      break;
    case 'PGRST116':
      message = 'No encontramos lo que buscabas.';
      break;
    case 'PGRST301':
      message = 'Tu sesión ha caducado. Vuelve a iniciar sesión.';
      break;
    default:
      message = 'No pudimos completar la operación. Inténtalo de nuevo.';
  }
  return { message, status: 0, code };
}

export function parseApiError(error) {
  if (error?.code) return parseSupabaseError(error);

  const status = error?.status ?? 0;

  let message;
  switch (status) {
    case 401:
    case 403:
      message = 'No autorizado. Revisa el token de TMDB.';
      break;
    case 404:
      message = 'No encontramos lo que buscabas.';
      break;
    case 408:
      message = 'La solicitud tardó demasiado. Inténtalo de nuevo.';
      break;
    case 429:
      message = 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.';
      break;
    default:
      if (status >= 500) {
        message = 'El servicio no responde. Inténtalo más tarde.';
      } else if (status === 0) {
        message = 'Error de conexión. Verifica tu red.';
      } else {
        message = 'Algo salió mal. Inténtalo de nuevo.';
      }
  }

  return { message, status };
}
