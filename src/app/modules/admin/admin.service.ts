import type { JwtPayload } from "jsonwebtoken";
import { AccountStatus, Role } from "../../../generated/enums.js";
import AppError from "../../utils/AppError.js";
import prisma from "../../../lib/prisma.js";

export const getAllUserFromDB = async (loggedUser: JwtPayload) => {
  if (loggedUser.role !== Role.ADMIN && loggedUser.role !== Role.SUPER_ADMIN) {
    throw new AppError("Unauthorized!", 401);
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [{ role: Role.EMPLOYER }, { role: Role.FREELANCER }],
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return users;
};

export const suspendUserIntoDB = async (
  loggedUser: JwtPayload,
  userId: string,
) => {
  const admin = await prisma.user.findUnique({
    where: {
      id: loggedUser.userId,
    },
  });

  if (
    !admin ||
    (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN)
  ) {
    throw new AppError("Unauthorized!", 401);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
    throw new AppError("Cannot suspend an admin user!", 403);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: AccountStatus.SUSPENDED,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};
