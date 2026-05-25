import { Heart } from "lucide-react";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import copy from "@/config/copy.json";

export const FavoritesPage = () => (
  <section className="mx-auto max-w-7xl px-lg py-2xl">
    <h1 className="font-display text-display-md text-text-primary mb-lg">
      {copy.favorites.title}
    </h1>
    <EmptyState
      icon={Heart}
      title={copy.favorites.comingSoon}
    />
  </section>
);
