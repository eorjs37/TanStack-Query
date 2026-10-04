import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
export type Users = User[];
export interface User {
  name: string;
  age: number;
  isValid?: boolean;
  emails?: string[];
  photo?: {
    name: string;
    data: string; // Base64
  };
  id?: string;
}

export default function AddUser() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const queryClient = useQueryClient();

  useMutation({
    mutationFn: async (newUser: User) => {
      const res = await fetch("https://api.heropy.dev/v0/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("변이 중 에러 발생!"); // 변이 실패!
      return res.json();
    },
    onMutate: async (newUser) => {
      // 낙관적 업데이트 전에 사용자 목록 쿼리를 취소해 잠재적인 충돌 방지!
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // 캐시된 데이터(사용자 목록) 가져오기
      const previousUsers = queryClient.getQueryData<Users>(["users"]);

      // 낙관적업데이트
      if (previousUsers) {
        queryClient.setQueryData<Users>(["users"], [...previousUsers, newUser]);
      }

      // 각 콜백의 context로 전달할 데이터 반환
      return { previousUsers };
    },
    onSuccess: (data, newUser, onMutateResult) => {
      console.log("onSuccess", data, newUser, onMutateResult);
      // 변이 성공 시 캐시 무효화로 사용자 목록 데이터 갱신!
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error, newUser, onMutateResult) => {
      console.log("onError", error, newUser, onMutateResult);
      // 변이 실패 시, 낙관적 업데이트 결과를 이전 사용자 목록으로 되돌리기!
      if (onMutateResult) {
        queryClient.setQueryData(["users"], onMutateResult.previousUsers);
      }
    },
    onSettled: (data, error, newUser, onMutateResult) => {
      console.log("onSettled", data, error, newUser, onMutateResult);
    },
    retry: 3,
    retryDelay: 500,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="사용자 이름"
      />
      <input
        type="number"
        value={age || ""}
        onChange={(e) => setAge(Number.parseInt(e.target.value, 10))}
        placeholder="사용자 나이"
      />
      <button type="submit">사용자 추가하기!</button>
    </form>
  );
}
