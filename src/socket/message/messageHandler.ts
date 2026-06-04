import { Server, Socket } from "socket.io";

const messageHandler = (io: Server, socket: Socket) => {
  socket.on("message", (message) => {
    console.log("Received message:", message);
    console.log(socket.data.user);

    socket.broadcast.emit("message", message);
  });
};

export default messageHandler;
