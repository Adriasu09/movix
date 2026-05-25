import { Link } from "react-router-dom";
import { UserRound, Mail, Calendar, Heart, ChevronRight } from "lucide-react";
import { useSession } from "@/features/auth/hooks/useSession";
import { ROUTES } from "@/config/routesConfig";
import copy from "@/config/copy.json";

export const ProfilePage = () => {
  const { user } = useSession();

  if (!user) return null;

  const displayName = user.fullName || user.firstName || copy.profile.fallbackName;

  const memberSince = user.createdAt
    ? copy.profile.memberSince.replace(
        "{date}",
        new Date(user.createdAt).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
        })
      )
    : null;

  return (
    <div className="mx-auto max-w-7xl px-lg py-2xl space-y-lg">
      <h1 className="font-display text-display-md text-text-primary">
        {copy.profile.title}
      </h1>

      <div className="bg-bg-card border border-border-default rounded-mvx-lg p-lg">
        <div className="flex flex-col items-center gap-lg sm:flex-row sm:items-start">

          <div className="w-24 h-24 rounded-mvx-full overflow-hidden bg-bg-muted shrink-0 flex items-center justify-center">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={copy.profile.avatarAlt.replace("{name}", displayName)}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound aria-hidden="true" className="h-10 w-10 text-text-muted" />
            )}
          </div>

          <div className="flex-1 space-y-sm text-center sm:text-left">
            <div>
              <h2 className="font-display text-display-xs text-text-primary">
                {displayName}
              </h2>
              {user.username && (
                <p className="text-main-sm text-text-muted">@{user.username}</p>
              )}
            </div>

            <div className="flex flex-col gap-xs text-main-sm text-text-secondary">
              {user.email && (
                <span className="flex items-center gap-xs justify-center sm:justify-start">
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {user.email}
                </span>
              )}
              {memberSince && (
                <span className="flex items-center gap-xs justify-center sm:justify-start">
                  <Calendar aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {memberSince}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Link
        to={ROUTES.favorites}
        className="group block bg-bg-card border border-border-default rounded-mvx-lg p-lg transition-colors hover:border-gold-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
      >
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-md">
            <div className="p-sm rounded-mvx-full bg-gold-500/10 shrink-0">
              <Heart aria-hidden="true" className="h-5 w-5 text-gold-500" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-main-md">
                {copy.profile.favoritesCard.title}
              </p>
              <p className="text-main-sm text-text-secondary">
                {copy.profile.favoritesCard.subtitle}
              </p>
            </div>
          </div>
          <ChevronRight
            aria-hidden="true"
            className="h-5 w-5 text-text-muted transition-transform group-hover:translate-x-1 shrink-0"
          />
        </div>
      </Link>
    </div>
  );
};
