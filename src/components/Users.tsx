import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface Page {
  content: Array<string>;
  size: number;
  page: number;
  totalElements: number;
}
export default function Users() {
  const [isEnabled, setIsEnabled] = useState(false);

  const onClick = () => {
    if (!isEnabled) setIsEnabled(true);
    fetchNextPage();
  };

  const { fetchNextPage } = useInfiniteQuery<Page>({
    queryKey: ["users"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`http://localhost:8080/users?page=${pageParam}`);

      return res.json();
    },
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

  return (
    <>
      <button onClick={onClick}>조회</button>
      <div>Users</div>
    </>
  );
}
