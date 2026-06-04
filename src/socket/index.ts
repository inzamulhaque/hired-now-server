import { Server } from "socket.io";
import AppError from "../app/utils/AppError.js";
import messageHandler from "./message/messageHandler.js";
import socketAuth from "./middleware/socketAuth.js";
import { Role } from "../generated/enums.js";

let io: Server;

export const initSocketServer = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(socketAuth(Role.EMPLOYER, Role.FREELANCER));

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);
    socket.emit("connected", {
      message: `Welcome! Your socket ID is ${socket.id}`,
    });

    messageHandler(io, socket);

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
