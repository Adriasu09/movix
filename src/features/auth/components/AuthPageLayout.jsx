import heroImage from '@/assets/hero-welcome.webp';
import { NavLink } from 'react-router-dom';
import { Play } from 'lucide-react';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

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

      <div className="relative z-10 space-y-sm px-2xl pb-2xl">
        <NavLink to={ROUTES.home} className="flex w-fit items-center gap-xs">
          <Play aria-hidden="true" className="h-6 w-6 fill-gold-500 text-gold-500" />
          <span className="font-display text-display-md tracking-tight text-gold-500 uppercase">
            {copy.appName}
          </span>
        </NavLink>
        <p className="text-main-lg text-text-secondary">{copy.auth.pageTagline}</p>
      </div>
    </div>

    <div className="relative z-10 flex w-full shrink-0 flex-col md:w-120 lg:w-135">
      <NavLink to={ROUTES.home} className="flex w-fit items-center gap-xs px-lg pt-xl md:hidden">
        <Play aria-hidden="true" className="h-5 w-5 fill-gold-500 text-gold-500" />
        <span className="font-display text-display-sm tracking-tight text-gold-500 uppercase">
          {copy.appName}
        </span>
      </NavLink>

      <div className="flex flex-1 items-center justify-center px-lg py-lg md:py-2xl">
        {children}
      </div>
    </div>
  </div>
);
