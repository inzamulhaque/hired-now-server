import type { Server, Socket } from "socket.io";
import prisma from "../../lib/prisma.js";

const notificationHandler = (socket: Socket) => {
  socket.on("getNotifications", async () => {
    const { userId } = socket.data.user;

    const notifications = await prisma.notification.findMany({
      where: { receiverId: userId },
      orderBy: [{ createdAt: "desc" }, { isRead: "asc" }],
    });

    socket.emit("notifications", notifications);
  });

  socket.on("markAsRead", async (payload: { notificationId: string }) => {
    const { userId } = socket.data.user;
    const { notificationId } = payload;

    await prisma.notification.update({
      where: { id: notificationId, receiverId: userId },
      data: { isRead: true },
    });
  });
};

export default notificationHandler;
