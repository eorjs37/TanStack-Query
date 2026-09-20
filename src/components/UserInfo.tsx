import { skipToken, useQuery } from "@tanstack/react-query";

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

export default function UserInfo({ id }: Props) {
  const { data, isPending, error } = useQuery({
    queryKey: ["user", id],
    queryFn: id ? () => fetchUser(id) : skipToken,
  });

  return (
    <>
      {isPending && <p>로딩중</p>}
      {data && <p>{data}</p>}
      {error && <p>{error.message}</p>}
    </>
  );
}
