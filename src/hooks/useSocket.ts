import { useEffect } from "react";
import { socketService } from "@/config/socketConfig";

export function useSocket() {
  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const emit = (event: string, data: unknown) => {
    socketService.emit(event, data);
  };

  const on = (event: string, callback: (data: unknown) => void) => {
    socketService.on(event, callback);
  };

  const off = (event: string, callback?: (data: unknown) => void) => {
    socketService.off(event, callback);
  };

  return {
    emit,
    on,
    off
  };
}
