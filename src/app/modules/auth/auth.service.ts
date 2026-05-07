import prisma from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import type { IUser } from "../user/user.interface.js";

export const createNewEmployerIntoDB = async (payload: IUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  // validate user exist with this email or not
  if (isUserExist) {
    throw new AppError("User Exist with this email!", 404);
  }
};
