import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  bannedAdminFromDB,
  createNewAdminIntoDB,
  reactivateAdminAccountIntoDB,
  suspendAdminAccountIntoDB,
} from "./superAdmin.service.js";

export const createNewAdmin = catchAsync(async (req, res) => {
  const user = req.user!;
  const payload = req.body;

  const result = await createNewAdminIntoDB(user, payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

export const suspendAdminAccount = catchAsync(async (req, res) => {
  const user = req.user!;
  const { adminId } = req.params;

  const result = await suspendAdminAccountIntoDB(user, adminId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin account suspended successfully!",
    data: result,
  });
});

export const reactivateAdminAccount = catchAsync(async (req, res) => {
  const user = req.user!;
  const { adminId } = req.params;

  const result = await reactivateAdminAccountIntoDB(user, adminId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin account reactivated successfully!",
    data: result,
  });
});

export const bannedAdmin = catchAsync(async (req, res) => {
  const user = req.user!;
  const { adminId } = req.params;

  const result = await bannedAdminFromDB(user, adminId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin account banned successfully!",
    data: result,
  });
});
