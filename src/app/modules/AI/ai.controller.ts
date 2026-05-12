import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { enhanceDescriptionService } from "./ai.service.js";

export const enhanceDescription = catchAsync(async (req, res) => {
  const user = req.user!;

  const result = await enhanceDescriptionService(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Description enhanced successfully!",
    data: result,
  });
});
