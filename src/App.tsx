import "./App.css";
import { ThemeProvider } from "@/components/base/theme/theme-provider";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/reactQueryConfig";
import { router } from "./router/router";
import { SocketProvider } from "./components/base/socketContext/SocketContext";
import { useEffect } from "react";
import { useStore } from "./store/useStore";

function App() {
  const { setUser } = useStore();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'app-storage' && event.newValue) {
        try {
          const newData = JSON.parse(event.newValue);
          if (newData.state && newData.state.user) {
            setUser(newData.state.user);
          }
        } catch (error) {
          console.error('Error parsing storage event data:', error);
        }
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUser]);
  
  useEffect(() => {
    const handleCustomStorageUpdate = (event: any) => {
      if (event.detail && event.detail.user) {
        setUser(event.detail.user);
      }
    };
    
    window.addEventListener('app-storage-update', handleCustomStorageUpdate as EventListener);
    
    return () => {
      window.removeEventListener('app-storage-update', handleCustomStorageUpdate as EventListener);
    };
  }, [setUser]);

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
