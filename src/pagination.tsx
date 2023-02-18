import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

export const Pagination = () => {
  const [page, setPage] = useState(1);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: ({ pageParam = 1 }) => {
      return {
        page: pageParam,
        nextPage: pageParam + 1,
        hasNext: pageParam < 3,
        previousPage: pageParam - 1,
        hasPrevious: pageParam > 1,
      };
    },
    keepPreviousData: true,
    getNextPageParam: (lastPage) => lastPage.hasNext && lastPage.nextPage,
    getPreviousPageParam: (_, allPages) => {
      const lastPage = allPages[allPages.length - 1];
      return lastPage?.hasPrevious && lastPage?.previousPage;
    },
  });

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (isError) {
    return <div>Error ...</div>;
  }

  const currentPage = data.pages.at(-1)?.page;

  return (
    <div>
      Current page: {currentPage}
      <button disabled={!hasPreviousPage} onClick={() => fetchPreviousPage()}>
        Previous page
      </button>
      <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        Next page
      </button>
    </div>
  );
};
