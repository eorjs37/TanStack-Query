import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

interface User {
  name: string;
  id: number;
  email: number;
}

interface Page {
  content: Array<User>;
  size: number;
  page: number;
  totalElements: number;
}
export function useUsers() {
  const [isEnabled, setIsEnabled] = useState(false);
  const fetchUsers = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<Page> => {
    const res = await fetch(`http://localhost:8080/users?page=${pageParam}`);

    return res.json();
  };

  const { data, fetchNextPage, isFetching, hasNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["users"],
      queryFn: fetchUsers,
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        const maxPage = Math.ceil(pages[0].totalElements / 10);

        const currentPage = lastPage.page;

        if (currentPage < maxPage) {
          return currentPage + 1;
        }

        return null;
      },
      enabled: isEnabled,
      staleTime: 1000 * 60 * 60, // 1시간
    });

  const onClick = () => {
    if (!isEnabled) setIsEnabled(true);
    fetchNextPage();
  };

  return {
    ...data,
    setIsEnabled,
    onClick,
    isFetching,
    hasNextPage,
    isPending,
  };
}
