import { FilterChip } from "@/features/movies/components/FilterChip";
import copy from "@/config/copy.json";

// Fila de chips para elegir el criterio de ordenación.
// Las opciones vienen de copy.json/filters.sortOptions para mantener
// textos centralizados (CLAUDE.md §12).
//
// Props:
//   activeSortBy – valor actual (p.ej. "popularity.desc")
//   onChange     – callback(value: string)
export const SortFilter = ({ activeSortBy = "popularity.desc", onChange }) => {
  return (
    <div className="space-y-sm">
      <p className="text-text-secondary text-main-sm font-medium">
        {copy.explore.filters.sortLabel}
      </p>
      <div className="flex gap-sm overflow-x-auto pb-xs scrollbar-none">
        {copy.filters.sortOptions.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            isActive={activeSortBy === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
};
