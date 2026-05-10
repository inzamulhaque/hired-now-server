import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { updateUserInfoIntoDB } from "./user.service.js";

export const updateUserInfo = catchAsync(async (req, res) => {
  const user = req.user!;

  const result = await updateUserInfoIntoDB(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User information updated successfully!",
    data: result,
  });
});
