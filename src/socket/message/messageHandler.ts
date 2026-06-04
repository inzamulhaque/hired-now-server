import { Server, Socket } from "socket.io";
import { Role } from "../../generated/enums.js";
import prisma from "../../lib/prisma.js";
import { sendMessageValidationSchema } from "./message.validation.js";

const messageHandler = (io: Server, socket: Socket) => {
  // Handle new message
  socket.on("sendMessage", async (payload) => {
    const { userId, role: userRole } = socket.data.user;

    const {
      success,
      data: message,
      error,
    } = sendMessageValidationSchema.safeParse(payload);

    if (!success) {
      console.error("Validation failed:", message);
      return socket.emit("error", {
        message: "Invalid message format",
        errors: error,
      });
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        employerId: userRole === Role.EMPLOYER ? userId : message.receiverId,
        freelancerId:
          userRole === Role.FREELANCER ? userId : message.receiverId,
      },
    });

    const messageData = await prisma.$transaction(async (tx) => {
      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            employerId:
              userRole === Role.EMPLOYER ? userId : message.receiverId,
            freelancerId:
              userRole === Role.FREELANCER ? userId : message.receiverId,
          },
        });
      }

      const newMessage = await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: userId,
          content: message.content,
        },
      });

      return newMessage;
    });

    io.to(message.receiverId).emit("newMessage", {
      conversationId: conversation?.id,
      senderId: userId,
      content: messageData.content,
      isRead: messageData.isRead,
      timestamp: messageData.createdAt,
    });
  });
};

export default messageHandler;
