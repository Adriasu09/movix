import { Calendar, Clapperboard, MapPin, UserRound } from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";
import copy from "@/config/copy.json";

// Fecha ISO → texto largo es-ES. Null si no hay fecha o es inválida.
const formatDateEs = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Calcula edad solo si la persona está viva (sin `deathday`).
const calcAge = (birthday, deathday) => {
  if (!birthday || deathday) return null;
  const birth = new Date(birthday);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// Cabecera de la ficha de persona (E2-08): foto grande, nombre,
// departamento, fecha + edad y lugar de nacimiento. Sin foto → icono
// UserRound. Cada bloque ausente se oculta (E2-15).
export const PersonDetailHeader = ({ person }) => {
  const birthDate = formatDateEs(person.birthday);
  const age = calcAge(person.birthday, person.deathday);
  // Prefiere la versión grande; cae a la media si no existe.
  const photoUrl = person.profileUrlLarge || person.profileUrl;

  return (
    <div className="gap-lg py-lg flex flex-col items-center sm:flex-row sm:items-start">
      {/* Foto */}
      <div className="bg-bg-muted rounded-mvx-xl aspect-[2/3] w-40 shrink-0 overflow-hidden shadow-lg sm:w-48">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={person.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound aria-hidden="true" className="text-text-muted h-16 w-16" />
          </div>
        )}
      </div>

      {/* Info */}
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
