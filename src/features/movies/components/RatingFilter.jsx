import { Select } from "@/shared/components/ui/Select";
import copy from "@/config/copy.json";

export const RatingFilter = ({ activeMinRating = "0", onChange }) => (
  <Select
    value={activeMinRating}
    onChange={(e) => onChange(e.target.value)}
    aria-label={copy.explore.filters.ratingLabel}
    options={copy.filters.ratingOptions}
  />
);
