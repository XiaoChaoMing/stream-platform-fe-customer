import{ createContext, useContext, useEffect, useState, ReactNode } from "react";
import { socketService } from "@/config/socketConfig"

type SocketContextType = {
  socket: typeof socketService;
  status: "connecting" | "connected" | "disconnected";
  socketId: string | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState(socketService.getConnectionStatus());
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    socketService.connect();

    const updateStatus = () => {
      setStatus(socketService.getConnectionStatus());
      setSocketId(socketService.getSocketId());
    };

    socketService.on("connect", updateStatus);
    socketService.on("disconnect", updateStatus);
    socketService.on("connect_error", updateStatus);

    return () => {
      socketService.off("connect", updateStatus);
      socketService.off("disconnect", updateStatus);
      socketService.off("connect_error", updateStatus);
      socketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketService,
        status,
        socketId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Hook tiện lợi để sử dụng trong component
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
