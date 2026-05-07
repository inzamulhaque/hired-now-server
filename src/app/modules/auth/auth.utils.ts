import prisma from "../../../lib/prisma.js";
import { OtpType } from "../../../generated/enums.js";

type EmailParams = {
  name: string;
  code: number;
  type: OtpType;
};

export const generateOtpCode = async (): Promise<{
  code: number;
  expiresAt: Date;
}> => {
  const otp = Math.floor(10000 + Math.random() * 90000);

  const existOtp = await prisma.otp.findFirst({
    where: {
      code: otp,
    },
  });

  if (existOtp) {
    return generateOtpCode();
  } else {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    return {
      code: otp,
      expiresAt,
    };
  }
};

export const getSubjectLine = (type: OtpType) => {
  switch (type) {
    case OtpType.EMAIL_VERIFICATION:
      return "Verify Your Email Address";
    case OtpType.PASSWORD_RESET:
      return "Reset Your Password";
    case OtpType.RESEND_OTP:
      return "Your New OTP Code";
    default:
      return "Verification Code";
  }
};

const getActionText = (type: OtpType) => {
  switch (type) {
    case OtpType.EMAIL_VERIFICATION:
      return "Use this code to verify your account";
    case OtpType.PASSWORD_RESET:
      return "Use this code to reset your password";
    case OtpType.RESEND_OTP:
      return "Here is your new verification code";
    default:
      return "Use this code to continue";
  }
};

export const generateOtpEmailTemplate = ({ name, code, type }: EmailParams) => {
  const message = getActionText(type);

  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:40px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background:#4f46e5; padding:20px; text-align:center; color:white;">
        <h1 style="margin:0;">HiredNow</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h2 style="color:#111827;">Hello ${name},</h2>
        <p style="color:#4b5563; font-size:16px;">${message}</p>

        <div style="margin:30px 0; text-align:center;">
          <div style="display:inline-block; padding:15px 30px; font-size:28px; letter-spacing:8px; background:#f3f4f6; border-radius:8px; font-weight:bold; color:#111827;">
            ${code}
          </div>
        </div>

        <p style="color:#6b7280; font-size:14px;">
          This code will expire in <b>5 minutes</b>. Do not share this code with anyone.
        </p>

        <p style="margin-top:30px; color:#374151;">
          Thanks,<br/>
          <b>HiredNow Team</b>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#9ca3af;">
        © ${new Date().getFullYear()} HiredNow. All rights reserved.
      </div>

    </div>
  </div>
  `;
};
