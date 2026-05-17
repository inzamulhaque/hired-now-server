import type { JwtPayload } from "jsonwebtoken";
import { Role } from "../../../generated/enums.js";
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
