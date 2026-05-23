import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routesConfig";
import copy from "@/config/copy.json";

// Card individual de un miembro del reparto: foto (o icono fallback),
// nombre y personaje. Navega a /people/:id (E2-11 navegación cruzada).
const ActorCard = ({ person }) => (
  <Link
    to={ROUTES.personDetail(person.id)}
    aria-label={copy.movieDetail.viewPersonAria.replace("{name}", person.name)}
    className="group rounded-mvx-lg w-28 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
  >
    <div className="bg-bg-muted rounded-mvx-lg mb-xs h-36 w-28 overflow-hidden">
      {person.profileUrl ? (
        <img
          src={person.profileUrl}
          alt={person.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <UserRound aria-hidden="true" className="text-text-muted h-10 w-10" />
        </div>
      )}
    </div>
    <p className="text-text-primary text-main-xs line-clamp-2 font-semibold leading-tight transition-colors group-hover:text-gold-500">
      {person.name}
    </p>
    {person.character && (
      <p className="text-text-muted text-main-xs line-clamp-1 mt-xs">{person.character}</p>
    )}
  </Link>
);

// Lista horizontal de reparto principal (E2-05). Sin reparto → no renderiza.
export const CastList = ({ cast = [] }) => {
  if (!cast || cast.length === 0) return null;

  // Máx 15 para no saturar — se mantiene scrollable.
  const display = cast.slice(0, 15);

  return (
    <section className="space-y-sm">
      <h2 className="text-text-primary font-display text-display-sm">
        {copy.movieDetail.sections.cast}
      </h2>
      <div className="gap-md pb-sm scrollbar-none flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {display.map((p) => (
          <ActorCard key={p.id} person={p} />
        ))}
      </div>
    </section>
  );
};
