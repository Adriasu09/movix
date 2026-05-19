import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Instancia única del cliente de TanStack Query para toda la app.
const queryClient = new QueryClient();

export const QueryProvider = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
