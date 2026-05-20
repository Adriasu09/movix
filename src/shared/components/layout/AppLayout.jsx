import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const AppLayout = () => {
  const { pathname } = useLocation();
  const isWelcome = pathname === "/";

  return (
    <div className="bg-bg-base text-text-primary flex min-h-screen flex-col">
      <Header transparent={isWelcome} />
      <main
        className={
          isWelcome
            ? "flex flex-1 flex-col"
            : "mx-auto w-full max-w-7xl flex-1 px-lg py-lg md:px-2xl"
        }
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
