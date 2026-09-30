import {
  queryOptions,
  skipToken,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface Props {
  id?: number;
}

const fetchUser = async (id: number) => {
  const response = await fetch(`http://localhost:8080/users/${id}`);

  if (!response.ok) {
    throw new Error("문제가 발생하였습니다");
  }

  return response.text();
};

const userQueryOptions = (id?: number) =>
  queryOptions({
    queryKey: ["user", id],
    queryFn: id ? () => fetchUser(id) : skipToken,
    staleTime: 1000 * 20,
  });

export default function UserInfo({ id }: Props) {
  const queryClient = useQueryClient();

  const { data, isPending, isLoading, isFetching, isStale } = useQuery(
    userQueryOptions(id),
  );

  async function refetchUser() {
    const cachedUser = await queryClient.query(userQueryOptions(id));

    console.log(cachedUser);
  }

  return (
    <>
      <div>isFetching: {JSON.stringify(isFetching)}</div>
      <div>isPending: {JSON.stringify(isPending)}</div>
      <div>isLoading: {JSON.stringify(isLoading)}</div>
      {isLoading ? (
        <div>로딩중</div>
      ) : (
        <>
          <p>{data}</p>
          <p>데이터가 상했나요?: {JSON.stringify(isStale)}</p>
          <button disabled={isFetching} onClick={() => refetchUser()}>
            {isFetching ? "데이터 가져오는 중.." : "데이터 다시가져오기"}
          </button>
        </>
      )}
    </>
  );
}
