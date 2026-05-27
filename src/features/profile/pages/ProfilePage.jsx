import { Link } from 'react-router-dom';
import { UserRound, Mail, Calendar, Heart, ChevronRight } from 'lucide-react';
import { useSession } from '@/features/auth/hooks/useSession';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

export const ProfilePage = () => {
  const { user } = useSession();

  if (!user) return null;

  const displayName = user.fullName || user.firstName || copy.profile.fallbackName;

  const memberSince = user.createdAt
    ? copy.profile.memberSince.replace(
        '{date}',
        new Date(user.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
        })
      )
    : null;

  return (
    <div className="mx-auto max-w-7xl space-y-lg px-lg py-2xl">
      <h1 className="font-display text-display-md text-text-primary">{copy.profile.title}</h1>

      <div className="rounded-mvx-lg border border-border-default bg-bg-card p-lg">
        <div className="flex flex-col items-center gap-lg sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-mvx-full bg-bg-muted">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={copy.profile.avatarAlt.replace('{name}', displayName)}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound aria-hidden="true" className="h-10 w-10 text-text-muted" />
            )}
          </div>

          <div className="flex-1 space-y-sm text-center sm:text-left">
            <div>
              <h2 className="font-display text-display-xs text-text-primary">{displayName}</h2>
              {user.username && <p className="text-main-sm text-text-muted">@{user.username}</p>}
            </div>

            <div className="flex flex-col gap-xs text-main-sm text-text-secondary">
              {user.email && (
                <span className="flex items-center justify-center gap-xs sm:justify-start">
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {user.email}
                </span>
              )}
              {memberSince && (
                <span className="flex items-center justify-center gap-xs sm:justify-start">
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
        className="group block rounded-mvx-lg border border-border-default bg-bg-card p-lg transition-colors hover:border-gold-500/40 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
      >
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-md">
            <div className="shrink-0 rounded-mvx-full bg-gold-500/10 p-sm">
              <Heart aria-hidden="true" className="h-5 w-5 text-gold-500" />
            </div>
            <div>
              <p className="text-main-md font-semibold text-text-primary">
                {copy.profile.favoritesCard.title}
              </p>
              <p className="text-main-sm text-text-secondary">
                {copy.profile.favoritesCard.subtitle}
              </p>
            </div>
          </div>
          <ChevronRight
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:translate-x-1"
          />
        </div>
      </Link>
    </div>
  );
};
