import { Route, Routes } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import { WelcomePage } from "@/pages/welcomePage/WelcomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ExplorePage } from "@/features/movies/pages/ExplorePage";
import { MovieDetailPage } from "@/features/movies/pages/MovieDetailPage";

// Todas las rutas viven aquí, anidadas bajo AppLayout.
// La ruta con :id usa patrón literal; ROUTES.movieDetail construye el enlace.
export const Router = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.home} element={<WelcomePage />} />
        <Route path={ROUTES.explore} element={<ExplorePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
