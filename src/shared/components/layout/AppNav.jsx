import { NavLink } from "react-router-dom";
import copy from "@/config/copy.json";

export const AppNav = ({ orientation = "horizontal", onLinkClick }) => {
  const containerClass =
    orientation === "horizontal" ? "flex flex-row items-center gap-lg" : "flex flex-col gap-md";

  return (
    <nav aria-label="Navegación principal">
      <ul className={containerClass}>
        {copy.nav.links.map((link) => (
          <li key={link.key}>
            {link.disabled ? (
              <span
                aria-disabled="true"
                aria-label={copy.nav.comingSoonAria}
                className="text-text-muted text-main-md cursor-not-allowed opacity-40"
              >
                {link.label}
              </span>
            ) : (
              <NavLink
                to={link.path}
                onClick={onLinkClick}
                end={link.path === "/"}
                className={({ isActive }) =>
                  [
                    "text-main-md font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-mvx-sm",
                    isActive
                      ? "text-gold-500 font-semibold"
                      : "text-text-secondary hover:text-text-primary",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
