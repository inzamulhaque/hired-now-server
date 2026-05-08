import type { JwtPayload, Secret } from "jsonwebtoken";
import type { Role } from "../../generated/enums.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/authToken.js";
import config from "../../config/index.js";
import prisma from "../../lib/prisma.js";

// augment Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...requiredRoles: Role[]) => {
  catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError("You are not authorized!", 401);
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

    if (user?.status !== "ACTIVE") {
      throw new AppError("This user is not active!", 401);
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
