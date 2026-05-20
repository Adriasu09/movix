import { NavLink } from "react-router-dom";
import { Play } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { ROUTES } from "@/shared/constants/routes";
import copy from "@/shared/constants/copy.json";

export const Header = () => {
  return (
    <header className="bg-bg-base/80 border-border-default/30 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-lg md:h-18 md:px-2xl">
        <NavLink to={ROUTES.home} className="flex items-center gap-xs">
          <Play aria-hidden="true" className="text-gold-500 fill-gold-500 h-4 w-4 md:h-5 md:w-5" />
          <span className="font-display text-gold-500 text-display-xs uppercase tracking-tight">
            {copy.appName}
          </span>
        </NavLink>
        <Button variant="outline" size="sm">
          {copy.auth.signIn}
        </Button>
      </div>
    </header>
  );
};
