import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = (): Socket => {
  if (socket) {
    return socket;
  }
  // if (!socket) {
  // socket = io(process.env.NEXTAUTH_URL, {
  //   autoConnect: false, // Optional, to control when to connect
  //   // reconnection: true,
  // });
  // }
  socket = io(process.env.NEXTAUTH_URL as string, {
    autoConnect: false, // Optional, to control when to connect
    reconnection: true,
  });
  return socket;
};
