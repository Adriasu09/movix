import heroImage from '@/assets/hero-welcome.webp';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

const resolveLogoTo = (from) => {
  const fromInsideApp = from && from !== ROUTES.home;
  return fromInsideApp ? ROUTES.explore : ROUTES.home;
};

const BrandLogo = ({ to, size = 'md' }) => {
  const playSize = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  const textSize = size === 'lg' ? 'text-display-md' : 'text-display-sm';
  return (
    <NavLink to={to} className="flex w-fit items-center gap-xs">
      <Play aria-hidden="true" className={`${playSize} fill-gold-500 text-gold-500`} />
      <span
        className={`font-display ${textSize} cursor-pointer tracking-tight text-gold-500 uppercase`}
      >
        {copy.appName}
      </span>
    </NavLink>
  );
};

export const AuthPageLayout = ({ children, from }) => {
  const navigate = useNavigate();
  const logoTo = resolveLogoTo(from);

  const handleBack = () => {
    const hasHistory = (window.history.state?.idx ?? 0) > 0;
    if (hasHistory) {
      navigate(-1);
    } else {
      navigate(ROUTES.home, { replace: true });
    }
  };

  return (
    <div className="relative flex flex-1">
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-bg-base/65 md:hidden" />

      <div className="relative hidden md:flex md:flex-1 md:flex-col md:justify-between">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-bg-base/55" />
        <div aria-hidden="true" className="bg-auth-panel-fade absolute inset-0" />

        <div className="relative z-10 space-y-sm px-2xl pt-2xl">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            aria-label={copy.auth.backAriaLabel}
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {copy.auth.back}
          </Button>
        </div>

        <div className="relative z-10 space-y-sm px-2xl pb-2xl">
          <BrandLogo to={logoTo} size="lg" />
          <p className="text-main-lg text-text-secondary">{copy.auth.pageTagline}</p>
        </div>
      </div>

      <div className="relative z-10 flex w-full shrink-0 flex-col md:w-120 lg:w-135">
        <div className="flex w-fit items-center gap-xs px-lg pt-xl md:hidden">
          <BrandLogo to={logoTo} size="md" />
        </div>

        <div className="flex flex-1 items-center justify-center px-lg py-lg md:py-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};
