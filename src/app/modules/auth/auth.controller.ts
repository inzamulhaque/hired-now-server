import config from "../../../config/index.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  changePasswordIntoDB,
  createNewAccountIntoDB,
  signinService,
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
