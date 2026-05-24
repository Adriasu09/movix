import copy from "@/config/copy.json";
import { ActorCard } from "./ActorCard";

export const CastList = ({ cast = [] }) => {
  if (!cast || cast.length === 0) return null;

  const display = cast.slice(0, 15);

  return (
    <section className="space-y-sm">
      <h2 className="text-text-primary font-display text-display-sm">
        {copy.movieDetail.sections.cast}
      </h2>
      <div className="gap-md pb-sm scrollbar-none flex overflow-x-auto md:flex-wrap">
        {display.map((p) => (
          <ActorCard key={p.id} person={p}/>
        ))}
      </div>
    </section>
  );
};
