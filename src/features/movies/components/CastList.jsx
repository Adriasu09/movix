import copy from '@/config/copy.json';
import { ActorCard } from './ActorCard';

export const CastList = ({ cast = [] }) => {
  if (!cast || cast.length === 0) return null;

  const display = cast.slice(0, 15);

  return (
    <section className="space-y-sm">
      <h2 className="font-display text-display-sm text-text-primary">
        {copy.movieDetail.sections.cast}
      </h2>
      <div className="flex scrollbar-none gap-md overflow-x-auto pb-sm md:flex-wrap">
        {display.map((p) => (
          <ActorCard key={p.id} person={p} />
        ))}
      </div>
    </section>
  );
};
