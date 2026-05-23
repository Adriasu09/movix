import { MovieGrid } from "@/features/movies/components/MovieGrid";
import copy from "@/config/copy.json";

// Sección con título + grid de películas; si no hay elementos, no renderiza.
// Reutiliza MovieGrid (que a su vez usa MovieCard) — los items vienen ya
// adaptados por mapTmdbPersonCredits con el shape mínimo que MovieCard espera.
const Section = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;
  return (
    <div className="space-y-md">
      <h3 className="text-text-secondary text-main-sm font-semibold uppercase tracking-wide">
        {title}
      </h3>
      <MovieGrid movies={movies} />
    </div>
  );
};

// Filmografía de la persona (E2-10). Dos secciones: "Como actor/actriz" y
// "Como director/directora". El bloque entero se oculta si no hay nada.
export const PersonFilmography = ({ credits }) => {
  if (!credits) return null;
  const { cast, crew } = credits;
  if (!cast?.length && !crew?.length) return null;

  return (
    <section className="space-y-lg">
      <h2 className="text-text-primary font-display text-display-sm">
        {copy.personDetail.sections.filmography}
      </h2>
      <Section title={copy.personDetail.filmography.asActor} movies={cast} />
      <Section title={copy.personDetail.filmography.asDirector} movies={crew} />
    </section>
  );
};
