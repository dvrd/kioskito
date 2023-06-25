"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { useIntersectionObserver } from 'usehooks-ts'

type Props = React.PropsWithChildren<{
  next: {
    hasNextPage: boolean
    endCursor: string
  }
  loadMoreAction: (next: { hasNextPage: boolean, endCursor: string }) => Promise<{ html: JSX.Element, next: { hasNextPage: boolean, endCursor: string } }>
}>

export const LoadMore = ({ children, next, loadMoreAction }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;
  const [pageInfo, setPageInfo] = useState(next);

  const [loadMoreNodes, setLoadMoreNodes] = useState<JSX.Element[]>(
    []
  );

  const [isLoading, startTransition] = useTransition()

  const loadMore = useCallback(
    (abortController?: AbortController) => {
      startTransition(async () => {
        const response = await loadMoreAction(pageInfo);

        if (abortController?.signal.aborted) return;

        setLoadMoreNodes((prev) => [...prev, response.html]);

        setPageInfo(response.next);
      });
    },
    [loadMoreAction, pageInfo]
  );

  useEffect(() => {
    const signal = new AbortController();

    if (isVisible && pageInfo.hasNextPage) {
      loadMore(signal);
    }

    return () => {
      signal.abort();
    };
  }, [loadMore, isVisible, pageInfo]);

  return (
    <>
      <div className="fixed container right-0 bottom-4 z-50 flex justify-end">
        <Button className="rounded-full" onClick={() => window.scrollTo({ left: 0, top: 0, behavior: "smooth" })}>
          <ArrowUp className="w-8 h-8" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 relative">
        {children}
        {loadMoreNodes}
      </div>
      <div ref={ref} />
    </>
  );
};

export default LoadMore;
