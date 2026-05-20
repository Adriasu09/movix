import heroImage from "@/assets/hero-welcome.webp";

export const HeroBackground = () => {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      <img src={heroImage} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-bg-base/80 to-transparent" />
      <div className="bg-hero-vignette absolute inset-0" />
      <div className="bg-hero-text-scrim absolute inset-0" />
      <div className="bg-hero-glow absolute inset-0 hidden blur-[60px] md:block" />
    </div>
  );
};
