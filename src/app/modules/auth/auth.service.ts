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
        role: Role.EMPLOYER,
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
