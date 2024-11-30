// socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      autoConnect: false, // Optional, to control when to connect
      reconnection: true,
    });
  }
  return socket;
};
