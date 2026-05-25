import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePerson, usePersonCredits } from "@/features/people/hooks/usePerson";
import { PersonDetailHeader } from "@/features/people/components/PersonDetailHeader";
import { PersonBio } from "@/features/people/components/PersonBio";
import { PersonFilmography } from "@/features/people/components/PersonFilmography";
import { PersonDetailSkeleton } from "@/features/people/components/PersonDetailSkeleton";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { parseApiError } from "@/shared/utils/parseApiError";
import { ROUTES } from "@/config/routesConfig";

export const PersonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: person, isLoading, isError, error, refetch } = usePerson(id);
  const { data: credits } = usePersonCredits(id);

  useEffect(() => {
    if (error?.status === 404) {
      navigate(ROUTES.notFound, { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) return <PersonDetailSkeleton />;

  if (isError && error?.status !== 404) {
    return (
      <div className="mx-auto max-w-screen-xl px-md py-2xl lg:px-lg">
        <ErrorState message={parseApiError(error).message} onRetry={refetch} />
      </div>
    );
  }

  if (!person) return null;

  return (
    <div className="mx-auto max-w-screen-xl space-y-2xl px-md py-lg lg:px-lg">
      <PersonDetailHeader person={person} />
      <hr className="border-border-default" />
      <PersonBio biography={person.biography} />
      <PersonFilmography credits={credits} />
    </div>
  );
};
