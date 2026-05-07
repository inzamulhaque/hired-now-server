import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNewAccountIntoDB } from "./auth.service.js";

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
