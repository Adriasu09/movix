import { Loader2 } from "lucide-react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import copy from "@/config/copy.json";

export const InfiniteScrollSentinel = ({ onIntersect, isFetching, hasNextPage }) => {
  const sentinelRef = useIntersectionObserver(
    onIntersect,
    { rootMargin: "200px" },
    hasNextPage && !isFetching
  );

  return (
    <div ref={sentinelRef} className="flex justify-center py-xl" aria-live="polite">
      {isFetching && (
        <Loader2
          aria-label={copy.messages.loading}
          className="text-gold-500 h-6 w-6 animate-spin"
        />
      )}
      {!hasNextPage && !isFetching && (
        <p className="text-text-muted text-main-sm">{copy.messages.endOfResults}</p>
      )}
    </div>
  );
};
