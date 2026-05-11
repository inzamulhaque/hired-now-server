import type { JwtPayload } from "jsonwebtoken";

import type { IUser } from "./user.interface.js";
import prisma from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import { AccountStatus } from "../../../generated/enums.js";

export const updateUserInfoIntoDB = async (
  loggedUser: JwtPayload,
  payload: Partial<Pick<IUser, "name" | "status">>,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: loggedUser.userId,
      role: loggedUser.role,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  //   check user is attempting to update the account status. validate account status update permissions
  if (
    payload.status &&
    payload.status !== AccountStatus.ACTIVE &&
    payload.status !== AccountStatus.INACTIVE
  ) {
    throw new AppError(
      "You are only allowed to update your account status to ACTIVE or INACTIVE.",
      400,
    );
  }

  const result = await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      ...payload,
    },

    select: {
      name: true,
      email: true,
      status: true,
    },
  });

  return result;
};
