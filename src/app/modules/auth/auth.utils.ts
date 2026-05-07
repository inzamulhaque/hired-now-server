import prisma from "../../../lib/prisma.js";

const generateOtpCode = async () => {
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

export default generateOtpCode;
