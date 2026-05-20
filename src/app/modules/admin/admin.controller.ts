import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { getAllUserFromDB, suspendUserIntoDB } from "./admin.service.js";

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

export const suspendUser = catchAsync(async (req, res) => {
  const user = req.user!;
  const { userId } = req.params;

  const result = await suspendUserIntoDB(user, userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User suspended successfully!",
    data: result,
  });
});
