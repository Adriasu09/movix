import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { Router } from "@/app/Router";

export const App = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryProvider>
  );
};
