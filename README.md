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
