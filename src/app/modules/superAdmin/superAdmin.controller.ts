import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  createNewAdminIntoDB,
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
