import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNewJobIntoDB } from "./jobs.service.js";

export const createNewJob = catchAsync(async (req, res) => {
  const user = req.user!;
  const jobData = req.body;

  const result = await createNewJobIntoDB(user, jobData);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Job created successfully!",
    data: result,
  });
});
