import config from "../../../config/index.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  changePasswordIntoDB,
  createNewAccountIntoDB,
  forgotPasswordService,
  resendOtpService,
  resetPasswordIntoDB,
  signinService,
  verifyAccountService,
  verifyResetOtpService,
} from "./auth.service.js";

export const createNewAccount = catchAsync(async (req, res) => {
  const result = await createNewAccountIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message:
      "Account created successfully. Please verify your email address to activate your account.",
    data: result,
  });
});

export const signin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await signinService(email, password);

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in successfully!",
    data: { token: accessToken },
  });
});

export const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId, role } = req.user!;

  const result = await changePasswordIntoDB({
    oldPassword,
    newPassword,
    userId,
    role,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your password has been changed successfully!",
    data: result,
  });
});

export const signOutUser = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken");

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Signed out successfully!",
  });
});

export const resendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await resendOtpService(email as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "A new OTP has been sent to your email address successfully!",
    data: result,
  });
});

export const verifyAccount = catchAsync(async (req, res) => {
  const { email, code } = req.body;

  const { refreshToken, ...result } = await verifyAccountService({
    email,
    code,
  });

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your account has been successfully verified!",
    data: result,
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await forgotPasswordService(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message:
      "A password reset verification code has been sent to your email address!",
    data: result,
  });
});

export const verifyResetOtp = catchAsync(async (req, res) => {
  const { email, code } = req.body;

  const result = await verifyResetOtpService({ email, code });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP verified successfully. You can now reset your password!",
    data: result,
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { userId, role } = req.user!;
  const { password } = req.body;

  const result = await resetPasswordIntoDB({
    userId,
    role,
    password,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your password has been reset successfully!",
    data: result,
  });
});
