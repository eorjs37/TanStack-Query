import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Users from "./components/Users";
import AddUser from "./components/AddUser";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
      <AddUser />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
