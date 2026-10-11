import { Fragment } from "react";
import { useUsers } from "../hooks/useUsers";

export default function Users() {
  const { isPending, hasNextPage, isFetching, onClick, pages } = useUsers();

  return (
    <>
      <div>
        Users
        {pages?.map((page, index) => (
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
      {(isPending || hasNextPage) && (
        <button disabled={isFetching} onClick={onClick}>
          {isFetching ? "로딩중" : "조회"}
        </button>
      )}
    </>
  );
}
