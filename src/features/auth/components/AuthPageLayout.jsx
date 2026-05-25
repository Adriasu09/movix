import heroImage from "@/assets/hero-welcome.webp";
import { NavLink } from "react-router-dom";
import { Play } from "lucide-react";
import { ROUTES } from "@/config/routesConfig";
import copy from "@/config/copy.json";

export const AuthPageLayout = ({ children }) => (
  <div className="relative flex flex-1">
    <img
      src={heroImage}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
    />
    <div aria-hidden="true" className="absolute inset-0 bg-bg-base/65 md:hidden" />

    <div className="relative hidden md:flex md:flex-1 md:flex-col md:justify-end">
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-bg-base/55" />
      <div aria-hidden="true" className="bg-auth-panel-fade absolute inset-0" />

      <div className="relative z-10 px-2xl pb-2xl space-y-sm">
        <NavLink to={ROUTES.home} className="flex items-center gap-xs w-fit">
          <Play aria-hidden="true" className="text-gold-500 fill-gold-500 h-6 w-6" />
          <span className="font-display text-gold-500 text-display-md tracking-tight uppercase">
            {copy.appName}
          </span>
        </NavLink>
        <p className="text-text-secondary text-main-lg">{copy.auth.pageTagline}</p>
      </div>
    </div>

    <div className="relative z-10 flex w-full flex-col md:w-120 lg:w-135 shrink-0">
      <NavLink to={ROUTES.home} className="md:hidden flex items-center gap-xs px-lg pt-xl w-fit">
        <Play aria-hidden="true" className="text-gold-500 fill-gold-500 h-5 w-5" />
        <span className="font-display text-gold-500 text-display-sm tracking-tight uppercase">
          {copy.appName}
        </span>
      </NavLink>

      <div className="flex flex-1 items-center justify-center px-lg py-lg md:py-2xl">
        {children}
      </div>
    </div>
  </div>
);
