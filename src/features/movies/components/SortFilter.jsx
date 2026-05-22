import { Select } from "@/shared/components/ui/Select";
import copy from "@/config/copy.json";

export const SortFilter = ({ activeSortBy = "popularity.desc", onChange }) => (
  <Select
    value={activeSortBy}
    onChange={(e) => onChange(e.target.value)}
    aria-label={copy.explore.filters.sortLabel}
    options={copy.filters.sortOptions}
  />
);
