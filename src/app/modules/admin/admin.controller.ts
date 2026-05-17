import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { getAllUserFromDB } from "./admin.service.js";

export const getAllUser = catchAsync(async (req, res) => {
  const user = req.user!;

  const result = await getAllUserFromDB(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});
