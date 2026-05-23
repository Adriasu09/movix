import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min: reduce llamadas repetidas a TMDB
      retry: 1, // 1 reintento automático ante error
      refetchOnWindowFocus: false, // no refetch al volver a la pestaña
    },
  },
});

export const QueryProvider = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
