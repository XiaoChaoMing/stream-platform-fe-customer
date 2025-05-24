import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private connectionStatus: "connecting" | "connected" | "disconnected" =
    "disconnected";

  connect() {
    if (this.socket) return;

    this.connectionStatus = "connecting";

    this.socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
      {
        autoConnect: true,
        withCredentials: true,
        transports: ["websocket"],
        auth: {
          token: localStorage.getItem("token")
        },
      }
    );

    this.setupListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus = "disconnected";
    }
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.connectionStatus = "connected";
    });

    this.socket.on("disconnect", () => {
      this.connectionStatus = "disconnected";
    });

    this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      this.connectionStatus = "disconnected";
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    this.socket.on("notification", (data) => {
      // Handle notifications
      console.log("New notification:", data);
    });

    this.socket.on("message", (data) => {
      // Handle messages
      console.log("New message:", data);
    });
  }

  // Check if socket exists and is connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get the socket ID if connected
  getSocketId(): string | null {
    return this.socket?.id || null;
  }

  // Get detailed connection status
  getConnectionStatus(): "connecting" | "connected" | "disconnected" {
    return this.connectionStatus;
  }

  // Force reconnection attempt
  reconnect(): void {
    this.disconnect();
    this.connect();
  }

  // Emit events
  emit(event: string, data: any) {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit(event, data);
  }

  // Subscribe to events
  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }
    this.socket.on(event, callback);
  }

  // Unsubscribe from events
  off(event: string, callback?: (data: any) => void) {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
