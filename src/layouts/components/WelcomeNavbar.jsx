import { Play } from "lucide-react";

export const WelcomeNavbar = () => {
  return (
    <div className="flex justify-between py-md px-lg">
      <div className="text-gold-500 flex gap-xs">
        <Play className="fill-gold-500" />
        <p className="font-display text-display-sm">Movix</p>
      </div>
      <button className="text-border-gold border border-border-gold px-md rounded-mvx-md">Sign in</button>
    </div>
  );
};
