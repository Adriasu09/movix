import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { Router } from "@/app/Router";

// Orden de providers: Clerk fuera, Query dentro.
// Día 6 hará queries autenticadas a Supabase con el token de Clerk → Clerk debe inicializar antes.
export const App = () => {
  return (
    <AuthProvider>
      <QueryProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  );
};
