import copy from "@/config/copy.json";

// Formatea minutos a "Xh Ym".
const formatRuntime = (mins) => {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Fecha ISO (yyyy-mm-dd) → texto largo en es-ES. Null si no hay fecha.
const formatDateEs = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Sección de info de la ficha (E2-03): sinopsis + grid de detalles
// (estreno, idioma original, duración, país). Los detalles ausentes no se
// renderizan — manejo de datos faltantes (E2-15).
export const MovieDetailInfo = ({ movie }) => {
  const details = [
    {
      key: "release",
      label: copy.movieDetail.details.releaseDate,
      value: formatDateEs(movie.releaseDate),
    },
    {
      key: "language",
      label: copy.movieDetail.details.originalLanguage,
      value: movie.originalLanguage ? movie.originalLanguage.toUpperCase() : null,
    },
    {
      key: "runtime",
      label: copy.movieDetail.details.runtime,
      value: formatRuntime(movie.runtime),
    },
    {
      key: "country",
      label: copy.movieDetail.details.country,
      value: movie.productionCountries?.[0] || null,
    },
  ].filter((d) => d.value);

  return (
    <section className="space-y-xl">
      {/* Sinopsis (siempre presente — fallback noData si está vacía) */}
      <div className="space-y-sm">
        <h2 className="text-text-primary font-display text-display-sm">
          {copy.movieDetail.sections.synopsis}
        </h2>
        <p className="text-text-secondary text-main-md leading-relaxed">
          {movie.overview || copy.messages.noData}
        </p>
      </div>

      {/* Grid de detalles — solo los campos disponibles */}
      {details.length > 0 && (
        <dl className="grid grid-cols-2 gap-md sm:grid-cols-4">
          {details.map((d) => (
            <div key={d.key} className="space-y-xs">
              <dt className="text-text-muted text-main-xs uppercase tracking-wide">
                {d.label}
              </dt>
              <dd className="text-text-primary text-main-sm font-medium">
                {d.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
