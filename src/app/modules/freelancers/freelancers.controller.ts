import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { createOrUpdateFreelancerProfileIntoDB } from "./freelancers.service.js";

export const createOrUpdateFreelancerProfile = catchAsync(async (req, res) => {
  const user = req.user!;

  const result = await createOrUpdateFreelancerProfileIntoDB(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Freelancer profile saved successfully!",
    data: result,
  });
});
