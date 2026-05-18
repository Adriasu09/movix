import { Route, Routes } from "react-router-dom";
import { WelcomePage } from "@/pages/WelcomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ExplorePage } from "@/features/movies/pages/ExplorePage";

// Todas las rutas de la app viven aquí.
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
