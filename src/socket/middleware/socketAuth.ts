import AppError from "../../app/utils/AppError.js";
import type { Secret } from "jsonwebtoken";
import { verifyToken } from "../../app/utils/authToken.js";
import config from "../../config/index.js";
import prisma from "../../lib/prisma.js";

const socketAuth = (...requiredRoles: string[]) => {
  return async (socket: any, next: any) => {
    const token = socket.handshake.headers.authorization;

    if (!token) {
      return next(new AppError("Authentication token is missing", 401));
    }

    const decoded = verifyToken(token, config.jwt.access_secret as Secret);

    if (!decoded) {
      throw new AppError("You are not authorized!", 401);
    }

    const { userId, role } = decoded;

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError("You are not authorized!", 401);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("This user is not found!", 401);
    }

    if (user?.status !== "ACTIVE" && user?.status !== "INACTIVE") {
      throw new AppError("This user is not active!", 401);
    }

    socket.data.user = decoded;

    next();
  };
};

export default socketAuth;
