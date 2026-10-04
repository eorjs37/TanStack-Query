import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";

interface User {
  name: string;
  id: number;
  email: number;
}
export interface Page {
  content: Array<User>;
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

  const { data, fetchNextPage, isFetching, hasNextPage, isPending } =
    useInfiniteQuery<Page>({
      queryKey: ["users"],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(
          `http://localhost:8080/users?page=${pageParam}`,
        );

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
      {(isPending || hasNextPage) && (
        <button disabled={isFetching} onClick={onClick}>
          {isFetching ? "로딩중" : "조회"}
        </button>
      )}

      <div>
        Users
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.content &&
              page.content.map((user) => (
                <div key={user.id}>
                  <p>
                    {user.id}/{user.name}/{user.email}
                  </p>
                </div>
              ))}
          </Fragment>
        ))}
      </div>
    </>
  );
}
