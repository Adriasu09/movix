import { Route, Routes } from "react-router-dom";
import { ROUTES } from "@/config/routesConfig";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import { WelcomePage } from "@/pages/welcomePage/WelcomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ExplorePage } from "@/features/movies/pages/ExplorePage";
import { MovieDetailPage } from "@/features/movies/pages/MovieDetailPage";
import { PersonDetailPage } from "@/features/people/pages/PersonDetailPage";
import { SignInPage } from "@/features/auth/pages/SignInPage";
import { SignUpPage } from "@/features/auth/pages/SignUpPage";

export const Router = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.home} element={<WelcomePage />} />
        <Route path={ROUTES.explore} element={<ExplorePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/people/:id" element={<PersonDetailPage />} />

        {/* Auth: el "/*" es obligatorio — Clerk renderiza sub-rutas internas */}
        {/* (verificación, MFA, SSO callback) bajo /sign-in/* y /sign-up/*.    */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Rutas protegidas se añaden en Fase E vía <ProtectedRoute/> */}

        <Route path={ROUTES.notFound} element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
