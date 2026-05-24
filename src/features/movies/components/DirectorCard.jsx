import { Clapperboard, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/shared/components/ui/Badge";
import { ROUTES } from "@/config/routesConfig";
import copy from "@/config/copy.json";

export const DirectorCard = ({ director }) => {
  if (!director) return null;

  return (
    <section className="space-y-sm">
      <h2 className="text-text-primary font-display text-display-sm">
        {copy.movieDetail.sections.director}
      </h2>
      <Link
        to={ROUTES.personDetail(director.id)}
        aria-label={copy.movieDetail.viewPersonAria.replace("{name}", director.name)}
        className="group border-border-default hover:border-border-strong rounded-mvx-lg gap-md p-sm focus-visible:ring-gold-500 focus-visible:ring-offset-bg-base flex items-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-fit"
      >
        <div className="bg-bg-muted rounded-mvx-full h-14 w-14 shrink-0 overflow-hidden">
          {director.profileUrl ? (
            <img
              src={director.profileUrl}
              alt={director.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserRound aria-hidden="true" className="text-text-muted h-6 w-6" />
            </div>
          )}
        </div>
        <div className="gap-xs flex flex-col">
          <p className="text-text-primary text-main-md font-semibold transition-colors group-hover:text-gold-500">
            {director.name}
          </p>
          <Badge>
            <Clapperboard aria-hidden="true" className="h-3 w-3" />
            {copy.movieDetail.directorLabel}
          </Badge>
        </div>
      </Link>
    </section>
  );
};
