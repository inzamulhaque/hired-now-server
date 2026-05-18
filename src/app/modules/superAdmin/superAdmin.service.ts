import bcrypt from "bcrypt";
import type { JwtPayload } from "jsonwebtoken";
import prisma from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import {
  adminWelcomeEmailTemplate,
  generateRandomPassword,
} from "./superAdmin.utils.js";
import type { IUser } from "../users/user.interface.js";
import config from "../../../config/index.js";
import { AccountStatus, Role } from "../../../generated/enums.js";
import sendEmail from "../../utils/sendEmail.js";

export const createNewAdminIntoDB = async (
  loggedUser: JwtPayload,
  payload: Omit<IUser, "id" | "password" | "role" | "createdAt" | "updatedAt">,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: loggedUser.id,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (user.role !== "SUPER_ADMIN") {
    throw new AppError("Only super admin can create new admin!", 403);
  }

  const password = generateRandomPassword();

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.password_hash_slot),
  );

  const newAdmin = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      role: Role.ADMIN,
      status: AccountStatus.PENDING_VERIFICATION,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  //   write email and send email to admin email address with initial password
  const emailHTML = adminWelcomeEmailTemplate({
    name: payload.name,
    email: payload.email,
    password,
  });
  await sendEmail(
    payload.email,
    "Your HiredNow Admin Account Has Been Created",
    emailHTML,
  );

  return newAdmin;
};

export const suspendAdminAccountIntoDB = async (
  loggedUser: JwtPayload,
  adminId: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: loggedUser.userId,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (user.role !== Role.SUPER_ADMIN) {
    throw new AppError("Only super admin can suspend admin account!", 403);
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
    },
  });

  if (!admin) {
    throw new AppError("Admin not found!", 404);
  }

  if (admin.role !== Role.ADMIN) {
    throw new AppError("The specified user is not an admin!", 400);
  }

  if (
    admin.status !== AccountStatus.ACTIVE &&
    admin.status !== AccountStatus.INACTIVE
  ) {
    throw new AppError(
      "Only active or inactive admin accounts can be suspended!",
      400,
    );
  }

  const updatedAdmin = await prisma.user.update({
    where: {
      id: adminId,
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

  return updatedAdmin;
};
