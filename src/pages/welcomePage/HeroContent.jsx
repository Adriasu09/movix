import { Badge } from '@/shared/components/ui/Badge';
import { Sparkles } from 'lucide-react';
import copy from '@/config/copy.json';
import { Button } from '@/shared/components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routesConfig';
import { ArrowRight, Lock } from 'lucide-react';

export const HeroContent = () => {
  return (
    <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-lg text-center">
      <Badge>
        <Sparkles className="h-md w-md" />
        {copy.welcome.badge}
      </Badge>
      <h1 className="mt-lg flex flex-col items-center gap-1 font-display text-display-3xl tracking-normal">
        <span className="text-text-primary">{copy.welcome.headline.line1}</span>
        <span className="text-gold-500 italic">{copy.welcome.headline.line2}</span>
      </h1>
      <p className="mt-lg max-w-75 font-main text-main-md text-text-secondary md:max-w-168">
        {copy.welcome.subtitle}
      </p>
      <Button
        as={Link}
        to={ROUTES.explore}
        variant="primary"
        size="md"
        className="mt-xl w-full shadow-gold md:w-auto"
      >
        {copy.welcome.ctaPrimary}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Button>
      <div className="mt-md flex items-center gap-xs text-main-xs text-text-muted">
        <Lock aria-hidden="true" className="h-3 w-3" />
        <span>{copy.welcome.subtext}</span>
      </div>
    </div>
  );
};
