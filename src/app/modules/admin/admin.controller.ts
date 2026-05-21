import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  bannedUserIntoDB,
  getAllUserFromDB,
  getSummaryStatsFromDB,
  reactivateSuspendedUserIntoDB,
  suspendUserIntoDB,
} from "./admin.service.js";
import { searchableFields } from "./admin.constants.js";

export const getAllUser = catchAsync(async (req, res) => {
  const user = req.user!;
  const searchParams = req.query;

  const { users, meta } = await getAllUserFromDB(user, {
    ...searchParams,
    searchableFields,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    data: users,
    meta,
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

export const bannedUser = catchAsync(async (req, res) => {
  const user = req.user!;
  const { userId } = req.params;

  const result = await bannedUserIntoDB(user, userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User banned successfully!",
    data: result,
  });
});

export const getSummaryStats = catchAsync(async (req, res) => {
  const user = req.user!;

  const result = await getSummaryStatsFromDB(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Summary stats retrieve successfully!",
    data: result,
  });
});
