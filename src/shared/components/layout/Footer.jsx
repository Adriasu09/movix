import copy from "@/config/copy.json";

// Separador decorativo entre items. aria-hidden para que el lector de
// pantalla no lo lea como "punto".
const Separator = () => (
  <span aria-hidden="true" className="mx-sm opacity-60">
    ·
  </span>
);

// Footer global: copyright + enlaces secundarios + crédito obligatorio TMDB.
// El crédito a TMDB es link externo (target _blank, rel noopener); el resto
// son labels planos hasta que existan sus páginas.
// Estilo: micro caption uppercase en mobile, body sm en case normal en desktop.
export const Footer = () => {
  const year = new Date().getFullYear();
  const { links, tmdb } = copy.footer;

  return (
    <footer className="border-border-default/20 bg-bg-base flex h-12 items-center justify-center border-t px-lg md:h-14 md:px-2xl">
      <p className="text-text-muted text-main-2xs tracking-wide uppercase md:text-main-sm md:tracking-normal md:normal-case">
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
          className="hover:text-text-primary underline transition-colors"
        >
          {tmdb.label}
        </a>
      </p>
    </footer>
  );
};
