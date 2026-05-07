import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNewEmployerIntoDB } from "./auth.service.js";

export const createNewEmployer = catchAsync(async (req, res) => {
  const result = await createNewEmployerIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message:
      "Employer account created successfully. Please verify your email address to activate your account.",
    data: result,
  });
});
