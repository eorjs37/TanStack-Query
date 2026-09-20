import { useQuery } from "@tanstack/react-query";

export default function Hello() {
  const { data, error } = useQuery<string>({
    queryKey: ["hello"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8080/hello");
      const data = res.text();

      if (!data) {
        throw Error("데이터가 없습니다");
      }
      return data;
    },
    staleTime: 1000 * 10,
    retry: 1,
  });

  return (
    <>
      <h1>{data}</h1>
      {error && <p>{error.message}</p>}
    </>
  );
}
