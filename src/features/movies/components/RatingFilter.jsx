import { FilterChip } from "@/features/movies/components/FilterChip";
import copy from "@/shared/constants/copy.json";

// Fila de chips para filtrar por puntuación mínima.
// El valor "0" equivale a "sin filtro" (todas las puntuaciones).
// Las opciones vienen de copy.json/filters.ratingOptions.
//
// Props:
//   activeMinRating – valor actual como string ("0", "6", "7", "8", "9")
//   onChange        – callback(value: string)
export const RatingFilter = ({ activeMinRating = "0", onChange }) => {
  return (
    <div className="space-y-sm">
      <p className="text-text-secondary text-main-sm font-medium">
        {copy.explore.filters.ratingLabel}
      </p>
      <div className="flex gap-sm overflow-x-auto pb-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {copy.filters.ratingOptions.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            isActive={activeMinRating === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
};
