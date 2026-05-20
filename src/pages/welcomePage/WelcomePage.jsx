import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";

export const WelcomePage = () => (
  <section className="relative flex flex-1 items-center justify-center overflow-hidden">
    <HeroBackground />
    <HeroContent />
  </section>
);
