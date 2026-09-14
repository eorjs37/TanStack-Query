import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DelayedData from "./components/DelayedData";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DelayedData />
    </QueryClientProvider>
  );
}

export default App;
