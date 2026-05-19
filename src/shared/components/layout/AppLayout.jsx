import { Outlet } from "react-router-dom";

// Layout raíz: contenedor a pantalla completa + slot de la ruta activa.
// El Header y Footer globales se añaden en la épica E1.
export const AppLayout = () => {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen">
      <Outlet />
    </div>
  );
};
