import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

export const AppLayout = () => {
  const { pathname } = useLocation();
  const isWelcome = pathname === "/";
  const isAuth = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  useScrollToTop();

  return (
    <div className="bg-bg-base text-text-primary flex min-h-screen flex-col">
      {!isAuth && <Navbar variant={isWelcome ? "welcome" : "app"} />}
      <main className={isWelcome || isAuth ? "flex flex-1 flex-col" : "flex-1 pt-14 md:pt-18"}>
        <Outlet />
      </main>
      {!isAuth && <Footer />}
    </div>
  );
};
