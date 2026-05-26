import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Search, X, ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/components/ui/Input';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

export const NavbarSearch = () => {
  const { pathname } = useLocation();
  if (pathname !== ROUTES.explore) return null;
  return <NavbarSearchInner />;
};

const NavbarSearchInner = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQ = searchParams.get('q') ?? '';
  const [isOpen, setIsOpen] = useState(() => urlQ !== '');
  const [inputValue, setInputValue] = useState(urlQ);
  const debouncedValue = useDebounce(inputValue, 400);

  useEffect(() => {
    if (debouncedValue === urlQ) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedValue) next.set('q', debouncedValue);
      else next.delete('q');
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    setInputValue(urlQ); // eslint-disable-line react-hooks/set-state-in-effect
  }, [urlQ]);

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <>
      <div className="relative hidden w-80 lg:block">
        <Search
          aria-hidden="true"
          className="absolute top-1/2 left-md h-4 w-4 -translate-y-1/2 text-text-muted"
        />
        <Input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={copy.explore.search.placeholder}
          aria-label={copy.explore.search.placeholder}
          className="px-xl py-xs"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={copy.explore.search.clearAriaLabel}
            className="absolute top-1/2 right-md -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={copy.nav.searchAriaLabel}
          className="rounded-mvx-sm p-xs text-text-primary transition-colors hover:text-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none lg:hidden"
        >
          <Search aria-hidden="true" className="h-5 w-5" />
        </button>
      )}

      {isOpen && (
        <div className="absolute inset-0 flex items-center gap-sm bg-bg-base/95 px-lg backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label={copy.nav.closeSearchAria}
            className="shrink-0 rounded-mvx-sm p-xs text-text-primary transition-colors hover:text-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </button>

          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-md h-4 w-4 -translate-y-1/2 text-text-muted"
            />
            <Input
              autoFocus
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={copy.explore.search.placeholder}
              aria-label={copy.explore.search.placeholder}
              className="py-xs pl-2xl"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                aria-label={copy.explore.search.clearAriaLabel}
                className="absolute top-1/2 right-md -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
