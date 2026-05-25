import { Calendar, Clapperboard, MapPin, UserRound } from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";
import copy from "@/config/copy.json";
import { formatDateEs, calcAge } from "@/shared/utils/formatters";

export const PersonDetailHeader = ({ person }) => {
  const birthDate = formatDateEs(person.birthday);
  const age = calcAge(person.birthday, person.deathday);
  const photoUrl = person.profileUrlLarge || person.profileUrl;

  return (
    <div className="gap-lg py-lg flex flex-col items-center sm:flex-row sm:items-start">
      <div className="bg-bg-muted rounded-mvx-xl aspect-2/3 w-40 shrink-0 overflow-hidden shadow-lg sm:w-48">
        {photoUrl ? (
          <img src={photoUrl} alt={person.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound aria-hidden="true" className="text-text-muted h-16 w-16" />
          </div>
        )}
      </div>

      <div className="gap-sm flex flex-col items-center text-center sm:items-start sm:text-left">
        <h1 className="text-text-primary font-display text-display-md sm:text-display-lg">
          {person.name}
        </h1>

        {person.knownForDepartment && (
          <Badge>
            <Clapperboard aria-hidden="true" className="h-3 w-3" />
            {person.knownForDepartment}
          </Badge>
        )}

        <div className="text-text-secondary text-main-sm gap-xs flex flex-col">
          {birthDate && (
            <span className="gap-xs flex items-center">
              <Calendar aria-hidden="true" className="h-4 w-4 shrink-0" />
              {birthDate}
              {age !== null && (
                <span className="text-text-muted text-main-xs">
                  ({copy.personDetail.ageSuffix.replace("{age}", age)})
                </span>
              )}
            </span>
          )}
          {person.placeOfBirth && (
            <span className="gap-xs flex items-center">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
              {person.placeOfBirth}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
