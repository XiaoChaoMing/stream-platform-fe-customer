import "./App.css";
import { ThemeProvider } from "@/components/base/theme/theme-provider";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/reactQueryConfig";
import { router } from "./router/router";
import { SocketProvider } from "./components/base/socketContext/SocketContext";
function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
