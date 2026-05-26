import { Clapperboard, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/Badge';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

export const DirectorCard = ({ director }) => {
  if (!director) return null;

  return (
    <section className="space-y-sm">
      <h2 className="font-display text-display-sm text-text-primary">
        {copy.movieDetail.sections.director}
      </h2>
      <Link
        to={ROUTES.personDetail(director.id)}
        aria-label={copy.movieDetail.viewPersonAria.replace('{name}', director.name)}
        className="group flex items-center gap-md rounded-mvx-lg border border-border-default p-sm transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base focus-visible:outline-none sm:w-fit"
      >
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-mvx-full bg-bg-muted">
          {director.profileUrl ? (
            <img
              src={director.profileUrl}
              alt={director.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserRound aria-hidden="true" className="h-6 w-6 text-text-muted" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-xs">
          <p className="text-main-md font-semibold text-text-primary transition-colors group-hover:text-gold-500">
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
