import { Select } from "@/shared/components/ui/Select";
import copy from "@/config/copy.json";

export const SortFilter = ({ activeSortBy = "popularity.desc", onChange, disabled = false }) => (
  <Select
    value={activeSortBy}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    aria-label={copy.explore.filters.sortLabel}
    options={copy.filters.sortOptions}
  />
);
