import { io, type Socket } from "socket.io-client";
import { env } from "../../../shared/utils/env";

class ChatSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(accessToken: string): Socket {
    if (this.socket && this.token === accessToken) return this.socket;
    this.disconnect();

    this.token = accessToken;
    this.socket = io(`${env.socketBaseUrl}/chatting`, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      timeout: 10_000,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 8_000,
    });
    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.token = null;
  }
}

export const chatSocketService = new ChatSocketService();
