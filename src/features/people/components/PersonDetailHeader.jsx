import { Calendar, Clapperboard, MapPin, UserRound } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import copy from '@/config/copy.json';
import { formatDateEs, calcAge } from '@/shared/utils/formatters';

export const PersonDetailHeader = ({ person }) => {
  const birthDate = formatDateEs(person.birthday);
  const age = calcAge(person.birthday, person.deathday);
  const photoUrl = person.profileUrlLarge || person.profileUrl;

  return (
    <div className="flex flex-col items-center gap-lg py-lg sm:flex-row sm:items-start">
      <div className="aspect-2/3 w-40 shrink-0 overflow-hidden rounded-mvx-xl bg-bg-muted shadow-lg sm:w-48">
        {photoUrl ? (
          <img src={photoUrl} alt={person.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound aria-hidden="true" className="h-16 w-16 text-text-muted" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-sm text-center sm:items-start sm:text-left">
        <h1 className="font-display text-display-md text-text-primary sm:text-display-lg">
          {person.name}
        </h1>

        {person.knownForDepartment && (
          <Badge>
            <Clapperboard aria-hidden="true" className="h-3 w-3" />
            {person.knownForDepartment}
          </Badge>
        )}

        <div className="flex flex-col gap-xs text-main-sm text-text-secondary">
          {birthDate && (
            <span className="flex items-center gap-xs">
              <Calendar aria-hidden="true" className="h-4 w-4 shrink-0" />
              {birthDate}
              {age !== null && (
                <span className="text-main-xs text-text-muted">
                  ({copy.personDetail.ageSuffix.replace('{age}', age)})
                </span>
              )}
            </span>
          )}
          {person.placeOfBirth && (
            <span className="flex items-center gap-xs">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
              {person.placeOfBirth}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
