import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  createOrUpdateFreelancerProfileIntoDB,
  getFreelancerProfileFromDB,
} from "./freelancers.service.js";

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

export const getFreelancerProfile = catchAsync(async (req, res) => {
  const user = req.user!;

  const result = await getFreelancerProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Freelancer profile retrieved successfully!",
    data: result,
  });
});
