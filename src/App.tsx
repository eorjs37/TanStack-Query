import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DelayedData from "./components/DelayedData";
import Hello from "./components/Hello";
import UserInfo from "./components/UserInfo";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DelayedData wait={500} index={0} />
      <DelayedData wait={3000} index={1} />
      <DelayedData wait={5000} index={2} />
      <Hello />
      <UserInfo id={1} />
    </QueryClientProvider>
  );
}

export default App;
