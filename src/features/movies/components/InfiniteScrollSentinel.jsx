import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { InlineSpinner } from '@/shared/components/feedback/InlineSpinner';
import { EndOfResults } from '@/shared/components/feedback/EndOfResults';

export const InfiniteScrollSentinel = ({ onIntersect, isFetching, hasNextPage }) => {
  const sentinelRef = useIntersectionObserver(
    onIntersect,
    { rootMargin: '500px' },
    hasNextPage && !isFetching
  );

  return (
    <div ref={sentinelRef} className="flex justify-center py-xl" aria-live="polite">
      {isFetching && <InlineSpinner />}
      {!hasNextPage && !isFetching && <EndOfResults />}
    </div>
  );
};
