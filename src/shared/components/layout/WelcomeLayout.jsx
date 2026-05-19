import { WelcomeNavbar } from "./WelcomeNavbar";

export const WelcomeLayout = ({ children }) => {
  return (
    <div>
      <WelcomeNavbar />
      <div className="w-full flex-1">{children}</div>
    </div>
  );
};
