import { useGenres } from "@/features/movies/hooks/useGenres";
import { FilterChip } from "@/features/movies/components/FilterChip";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import copy from "@/shared/constants/copy.json";

// Fila horizontal de chips de género.
// El chip "Todos" (value "") siempre aparece primero y limpia el filtro.
// Si la API falla, muestra silenciosamente solo el chip "Todos" (UX suave).
//
// Props:
//   activeGenre – id de género activo como string (o "" para todos)
//   onChange    – callback(genreId: string)
export const GenreFilter = ({ activeGenre = "", onChange }) => {
  const { data: genres, isLoading } = useGenres();

  return (
    <div className="space-y-sm">
      <p className="text-text-secondary text-main-sm font-medium">
        {copy.explore.filters.genresTitle}
      </p>
      {/* Scroll horizontal en mobile sin scrollbar visible */}
      <div className="flex gap-sm overflow-x-auto pb-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Chip "Todos" — siempre presente */}
        <FilterChip
          label={copy.explore.filters.allGenres}
          isActive={activeGenre === ""}
          onClick={() => onChange("")}
        />

        {isLoading
          ? // Skeletons mientras cargan los géneros de TMDB
            Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-mvx-full" />
            ))
          : genres?.map((genre) => (
              <FilterChip
                key={genre.id}
                label={genre.name}
                isActive={activeGenre === String(genre.id)}
                onClick={() =>
                  onChange(activeGenre === String(genre.id) ? "" : String(genre.id))
                }
              />
            ))}
      </div>
    </div>
  );
};
