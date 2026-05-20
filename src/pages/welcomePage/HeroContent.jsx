import { Badge } from "@/shared/components/ui/Badge";
import { Sparkles } from "lucide-react";
import copy from "@/shared/constants/copy.json";
import { Button } from "@/shared/components/ui/Button";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { ArrowRight, Lock } from "lucide-react";


export const HeroContent = () => {
  return (
    <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-lg text-center">
      <Badge>
        <Sparkles />
        {copy.welcome.badge}
      </Badge>
      <h1 className="font-display text-display-3xl mt-lg flex flex-col items-center gap-1 tracking-normal">
        <span className="text-text-primary">{copy.welcome.headline.line1}</span>
        <span className="text-gold-500 italic">{copy.welcome.headline.line2}</span>
      </h1>
      <p className="text-text-secondary font-main text-main-md mt-lg max-w-75 md:max-w-168">
        {copy.welcome.subtitle}
      </p>
      <Button
        as={Link}
        to={ROUTES.explore}
        variant="primary"
        size="md"
        className="mt-xl shadow-gold w-full md:w-auto"
      >
        {copy.welcome.ctaPrimary}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Button>
      <div className="text-text-muted text-main-xs mt-md flex items-center gap-xs">
        <Lock aria-hidden="true" className="h-3 w-3" />
        <span>{copy.welcome.subtext}</span>
      </div>
    </div>
  );
};
