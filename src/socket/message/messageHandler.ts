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

  // Handle message read
  socket.on("markAsRead", async (payload: { conversationId: string }) => {
    const { userId } = socket.data.user;

    await prisma.message.updateMany({
      where: {
        conversationId: payload.conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  });

  // Handle get all messages in a conversation
  socket.on("getMessages", async (payload: { conversationId: string }) => {
    const { userId } = socket.data.user;
    await prisma.conversation.findFirstOrThrow({
      where: {
        id: payload.conversationId,
        OR: [{ employerId: userId }, { freelancerId: userId }],
      },
    });

    const messages = await prisma.message.findMany({
      where: {
        conversationId: payload.conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    io.to(socket.id).emit("allMessages", messages);
    socket.emit("messages", messages);
  });
};

export default messageHandler;
