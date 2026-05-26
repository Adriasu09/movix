import { MovieGrid } from '@/features/movies/components/MovieGrid';
import copy from '@/config/copy.json';

const Section = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;
  return (
    <div className="space-y-md">
      <h3 className="text-main-sm font-semibold tracking-wide text-text-secondary uppercase">
        {title}
      </h3>
      <MovieGrid movies={movies} />
    </div>
  );
};

export const PersonFilmography = ({ credits }) => {
  if (!credits) return null;
  const { cast, crew } = credits;
  if (!cast?.length && !crew?.length) return null;

  return (
    <section className="space-y-lg">
      <h2 className="font-display text-display-sm text-text-primary">
        {copy.personDetail.sections.filmography}
      </h2>
      <Section title={copy.personDetail.filmography.asActor} movies={cast} />
      <Section title={copy.personDetail.filmography.asDirector} movies={crew} />
    </section>
  );
};
