import copy from '@/config/copy.json';

const Separator = () => (
  <span aria-hidden="true" className="mx-sm opacity-60">
    ·
  </span>
);

export const Footer = () => {
  const year = new Date().getFullYear();
  const { links, tmdb } = copy.footer;

  return (
    <footer className="flex h-12 items-center justify-center border-t border-border-default/20 bg-bg-base px-lg md:h-14 md:px-2xl">
      <p className="text-main-2xs tracking-wide text-text-muted uppercase md:text-main-sm md:tracking-normal md:normal-case">
        © {year} {copy.appName}
        <Separator />
        {links.privacy}
        <Separator />
        {links.terms}
        <span className="hidden md:inline">
          <Separator />
          {links.contact}
        </span>
        <Separator />
        <a
          href={tmdb.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tmdb.ariaLabel}
          className="underline transition-colors hover:text-text-primary"
        >
          {tmdb.label}
        </a>
      </p>
    </footer>
  );
};
