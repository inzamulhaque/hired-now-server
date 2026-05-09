import config from "../../../config/index.js";
import prisma from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import type { IUser } from "../user/user.interface.js";
import bcrypt from "bcrypt";
import {
  generateOtpCode,
  generateOtpEmailTemplate,
  getSubjectLine,
} from "./auth.utils.js";
import { AccountStatus, OtpType, Role } from "../../../generated/enums.js";
import sendEmail from "../../utils/sendEmail.js";
import { createToken } from "../../utils/authToken.js";
import type { Secret } from "jsonwebtoken";

export const createNewAccountIntoDB = async (payload: IUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  // validate user exist with this email or not
  if (isUserExist) {
    throw new AppError("User Exist with this email!", 404);
  }

  //   hash password
  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.password_hash_slot),
  );

  // generate otp code
  const otpPayload = await generateOtpCode();

  //   create HTML Template for email
  const emailHTML = generateOtpEmailTemplate({
    name: payload.name,
    code: otpPayload.code,
    type: OtpType.EMAIL_VERIFICATION,
  });

  //   use transaction for make sure user and otp both are created
  const result = await prisma.$transaction(async (tc) => {
    const user = await tc.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        status: AccountStatus.PENDING_VERIFICATION,
      },
    });

    await tc.otp.create({
      data: {
        ...otpPayload,
        type: OtpType.EMAIL_VERIFICATION,
        userId: user.id,
      },
    });

    return user;
  });

  //   remove password and unnecessary data
  const { password, previousPassword, id, ...restData } = result;

  //   create email subject line and send email
  const subjectLine = getSubjectLine(OtpType.EMAIL_VERIFICATION);
  await sendEmail(payload.email, subjectLine, emailHTML);

  return restData;
};

export const signinService = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (user.status === "PENDING_VERIFICATION") {
    // generate otp code
    const otpPayload = await generateOtpCode();

    //   create HTML Template for email
    const emailHTML = generateOtpEmailTemplate({
      name: user.name,
      code: otpPayload.code,
      type: OtpType.EMAIL_VERIFICATION,
    });

    //   create email subject line and send email
    const subjectLine = getSubjectLine(OtpType.EMAIL_VERIFICATION);
    await sendEmail(user.email, subjectLine, emailHTML);

    await prisma.otp.create({
      data: {
        userId: user.id,
        type: "EMAIL_VERIFICATION",
        ...otpPayload,
      },
    });

    throw new AppError(
      "Please verify your email address to activate your account!",
      400,
    );
  }

  if (user.status === "BANNED") {
    throw new AppError(
      "Your account has been banned. Please contact support for further assistance!",
      403,
    );
  }

  if (user.status === "SUSPENDED") {
    throw new AppError("Your account has been permanently suspended!", 403);
  }

  if (user.status === "DELETED") {
    throw new AppError("Your account has been permanently deleted!", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password!", 401);
  }

  const accessToken = createToken(
    { userId: user.id, role: user.role },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in,
  );

  const refreshToken = createToken(
    { userId: user.id, role: user.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const changePasswordIntoDB = async (payload: {
  oldPassword: string;
  newPassword: string;
  userId: string;
  role: Role;
}) => {
  const user = await prisma.user.findFirst({
    where: {
      id: payload.userId,
      role: payload.role,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    payload.oldPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError("Your current password is incorrect!", 401);
  }

  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(
      "New password cannot be the same as your current password!",
      400,
    );
  }

  if (user?.previousPassword) {
    const isNewPasswordSameAsPreviousPassword = await bcrypt.compare(
      payload.newPassword,
      user.previousPassword,
    );

    if (isNewPasswordSameAsPreviousPassword) {
      throw new AppError(
        "New password cannot be the same as your previous password!",
        400,
      );
    }
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.password_hash_slot),
  );

  const result = await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      password: hashedPassword,
      previousPassword: user.password,
    },

    select: {
      name: true,
      email: true,
    },
  });

  return result;
};
