import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import AppError from "../app/utils/AppError.js";

let io: Server;

export const initSocketServer = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId: string) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new AppError("Socket.io server not initialized!", 500);
  }

  return io;
};
