import { ArrowLeft, Film, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/Button";
import { ROUTES } from "@/config/routesConfig";
import copy from "@/config/copy.json";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-lg px-md py-2xl text-center">
      <div className="bg-bg-muted rounded-mvx-full p-lg">
        <Film aria-hidden="true" className="text-text-muted h-12 w-12" />
      </div>

      <div className="space-y-xs">
        <p className="text-text-muted font-display text-display-3xl font-bold">
          {copy.notFound.code}
        </p>
        <h1 className="text-text-primary font-display text-display-xs">{copy.notFound.title}</h1>
        <p className="text-text-secondary text-main-sm mx-auto">{copy.notFound.description}</p>
      </div>

      <div className="flex flex-col gap-sm sm:flex-row">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {copy.notFound.backCta}
        </Button>
        <Button as={Link} to={ROUTES.home} variant="primary" size="sm">
          <Home aria-hidden="true" className="h-4 w-4" />
          {copy.notFound.homeCta}
        </Button>
      </div>
    </div>
  );
};
