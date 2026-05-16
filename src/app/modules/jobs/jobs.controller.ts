import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  createJobApplicationIntoDB,
  createNewJobIntoDB,
  getAllApplicationByJobIdFromDB,
  getAllJobsFromDB,
  getJobByIdFromDB,
} from "./jobs.service.js";
import { searchableFields } from "./jobs.constants.js";

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

export const getAllJobs = catchAsync(async (req, res) => {
  const searchParams = req.query;

  const { jobs, meta } = await getAllJobsFromDB({
    ...searchParams,
    searchableFields,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Jobs retrieved successfully!",
    meta,
    data: jobs,
  });
});

export const getJobById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const job = await getJobByIdFromDB(id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Job retrieved successfully!",
    data: job,
  });
});

export const createJobApplication = catchAsync(async (req, res) => {
  const user = req.user!;
  const { jobId } = req.params;
  const applicationData = req.body;

  const result = await createJobApplicationIntoDB(
    user,
    jobId as string,
    applicationData,
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Application submitted successfully!",
    data: result,
  });
});

export const getAllApplicationByJobId = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const user = req.user!;

  const result = await getAllApplicationByJobIdFromDB(user, jobId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Applications retrieved successfully!",
    data: result,
  });
});
