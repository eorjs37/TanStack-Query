import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Users from "./components/Users";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
}

export default App;
