import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';
import { UserRound } from 'lucide-react';

export const ActorCard = ({ person }) => {
  return (
    <Link
      to={ROUTES.personDetail(person.id)}
      aria-label={copy.movieDetail.viewPersonAria.replace('{name}', person.name)}
      className="group w-28 shrink-0 rounded-mvx-lg focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base focus-visible:outline-none"
    >
      <div className="mb-xs h-36 w-28 overflow-hidden rounded-mvx-lg bg-bg-muted">
        {person.profileUrl ? (
          <img
            src={person.profileUrl}
            alt={person.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound aria-hidden="true" className="h-10 w-10 text-text-muted" />
          </div>
        )}
      </div>
      <p className="line-clamp-2 text-main-xs leading-tight font-semibold text-text-primary transition-colors group-hover:text-gold-500">
        {person.name}
      </p>
      {person.character && (
        <p className="mt-xs line-clamp-1 text-main-xs text-text-muted">{person.character}</p>
      )}
    </Link>
  );
};
