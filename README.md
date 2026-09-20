# TanStack Query

```
서버로부터 데이터가져오기/데이터캐싱/캐시제어 등 데이터를 쉽고 효율적으로 관리할 수 있는 라이브러리
v4부터 Vue/Svelte 다른 프레임워크에서도 활욜할 수 있도록 기능확장됨
```

## 기능

### useQuery

```
가장 기본적인 쿼리 훅, 컴퍼넌트에서 데이터를 가져올때 사용
```

#### queryKey

```
쿼리키는 쿼리를 식별하는 고유한 값,
배열 형태로 지정
다중 아이템 쿼리키를 사용할 때는, 아이템 순서가  중요
```

```tsx
import { useQuery } from "@tanstack/react-query";

type ResponseValue = {
  message: string;
  time: string;
};

type Props = {
  wait?: number;
  index: number;
};

export default function DelayedData({ wait = 1000, index }: Props) {
  const { data } = useQuery<ResponseValue>({
    queryKey: ["delay", wait], // 쿼리키 : 쿼리를 식별하는 식별값, 배열행태로 존재
    queryFn: async () =>
      // queryFn에서 변수는 queryKey에서 선언되야 사용이 가능하다
      (await fetch(`https://api.heropy.dev/v0/delay?t=${wait}`)).json(),
    staleTime: 1000 * 10,
  });
  return <div>{data?.time}</div>;
}
```

#### queryFn

```
쿼리함수는 데이터를 가져오는 비동기 함수로,
꼭 반환하거나 오류를 던져야 한다.
에러는 error 객체로 확인이 가능하다.
error는 기본적으로 null 이다.
```

##### qnueryFn 인수

- queryKey: 이 쿼리의 쿼리 키
- signal: 요청 취소에 사용하는 AbortSignal
- client: 쿼리 클라이언트 인스턴스
- meta: meta 옵션으로 지정한 추가 정보
- pageParam: 페이지 번호(useInfiniteQuery에서만)

###### 예시

```tsx
import { useQuery } from "@tanstack/react-query";

export default function Hello() {
  // data,error객체로 리턴 하여 error는 문제가 잇을경우 담아서, 리턴
  const { data, error } = useQuery<string>({
    queryKey: ["hello"], // 쿼리함수 Key 고유의키 값
    queryFn: async () => {
      // 쿼리함수의 함수 비동기로 실행
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
```

#### skipToken

```
특정조건일때 쿼리를 실행하고 싶지 않을때 사용
```

```tsx
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
```
