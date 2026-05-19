// Única fuente de verdad de las rutas de la app.
// Las estáticas son strings; las de detalle son funciones que construyen el path.
export const ROUTES = {
  home: "/",
  explore: "/explore",
  movieDetail: (id) => `/movies/${id}`,
};
