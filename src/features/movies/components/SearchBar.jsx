import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import copy from "@/config/copy.json";

export const SearchBar = ({ value = "", onChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 400);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange?.(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    setInputValue(value); // eslint-disable-line react-hooks/set-state-in-effect
  }, [value]);

  const handleClear = () => {
    setInputValue("");
    onChange?.("");
  };

  return (
    <div className="relative w-full md:max-w-125">
      <Search
        aria-hidden="true"
        className="text-text-muted absolute top-1/2 left-md h-4 w-4 -translate-y-1/2"
      />

      <Input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={copy.explore.search.placeholder}
        aria-label={copy.explore.search.placeholder}
        className="px-xl py-xs"
      />

      {/* Botón clear — solo visible si hay texto */}
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={copy.explore.search.clearAriaLabel}
          className="text-text-muted hover:text-text-primary absolute top-1/2 right-md -translate-y-1/2 transition-colors"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
