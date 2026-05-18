import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNewAdminIntoDB } from "./superAdmin.service.js";

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
