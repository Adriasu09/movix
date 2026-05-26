import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/config/routesConfig';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { WelcomePage } from '@/pages/welcomePage/WelcomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ExplorePage } from '@/features/movies/pages/ExplorePage';
import { MovieDetailPage } from '@/features/movies/pages/MovieDetailPage';
import { PersonDetailPage } from '@/features/people/pages/PersonDetailPage';
import { SignInPage } from '@/features/auth/pages/SignInPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { FavoritesPage } from '@/features/favorites/pages/FavoritesPage';

export const Router = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.home} element={<WelcomePage />} />
        <Route path={ROUTES.explore} element={<ExplorePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/people/:id" element={<PersonDetailPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.profile} element={<ProfilePage />} />
          <Route path={ROUTES.favorites} element={<FavoritesPage />} />
        </Route>

        <Route path={ROUTES.notFound} element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
