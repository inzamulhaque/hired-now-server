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

    if (userId === payload.receiverId) {
      return socket.emit("error", {
        message: "You cannot send a message to yourself",
      });
    }

    const sender = await prisma.user.findUnique({
      where: { id: userId },
    });

    const receiver = await prisma.user.findUnique({
      where: { id: message.receiverId },
    });

    if (!sender || !receiver) {
      return socket.emit("error", {
        message: "Sender or receiver not found",
      });
    }

    if (sender.role === receiver.role) {
      return socket.emit("error", {
        message: "Sender and receiver must have different roles",
      });
    }

    const { conversation, messageData } = await prisma.$transaction(
      async (tx) => {
        const conversation = await tx.conversation.upsert({
          where: {
            employerId_freelancerId: {
              employerId:
                userRole === Role.EMPLOYER
                  ? userId
                  : (message.receiverId as string),
              freelancerId:
                userRole === Role.FREELANCER
                  ? userId
                  : (message.receiverId as string),
            },
          },
          update: {},
          create: {
            employerId:
              userRole === Role.EMPLOYER
                ? userId
                : (message.receiverId as string),
            freelancerId:
              userRole === Role.FREELANCER
                ? userId
                : (message.receiverId as string),
          },
        });

        const newMessage = await tx.message.create({
          data: {
            conversationId: conversation.id,
            senderId: userId,
            content: message.content,
          },
        });

        return { conversation, messageData: newMessage };
      },
    );

    const payloadToSend = {
      conversationId: conversation.id,
      senderId: userId,
      content: messageData.content,
      isRead: messageData.isRead,
      timestamp: messageData.createdAt,
    };

    socket.emit("newMessage", payloadToSend);

    io.to(message.receiverId).emit("newMessage", payloadToSend);
  });

  // Handle message read
  socket.on("markAsRead", async (payload: { conversationId: string }) => {
    const { userId } = socket.data.user;

    const updatedMessage = await prisma.message.updateManyAndReturn({
      where: {
        conversationId: payload.conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        content: true,
        isRead: true,
      },
    });

    if (updatedMessage.length > 0) {
      io.to(userId).emit("messagesRead", {
        conversationId: payload.conversationId,
        messageIds: updatedMessage.map((msg) => msg.id),
      });

      io.to(updatedMessage[0].senderId).emit("messagesRead", {
        conversationId: payload.conversationId,
        messageIds: updatedMessage.map((msg) => msg.id),
      });
    }
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

    socket.emit("messages", messages);
  });
};

export default messageHandler;
