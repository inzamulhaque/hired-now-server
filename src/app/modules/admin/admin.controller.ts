import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  getAllUserFromDB,
  reactivateSuspendedUserIntoDB,
  suspendUserIntoDB,
} from "./admin.service.js";

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

export const reactivateSuspendedUser = catchAsync(async (req, res) => {
  const user = req.user!;
  const { userId } = req.params;

  const result = await reactivateSuspendedUserIntoDB(user, userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User reactivated successfully!",
    data: result,
  });
});
