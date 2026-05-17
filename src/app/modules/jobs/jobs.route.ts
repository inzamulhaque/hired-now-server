import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  applyJobValidationSchema,
  createNewJobValidationSchema,
  updateApplicationStatusValidationSchema,
  updateJobStatusValidationSchema,
} from "./jobs.validation.js";
import {
  createJobApplication,
  createNewJob,
  getAllApplicationByJobId,
  getAllJobs,
  getJobById,
  updateApplicationStatus,
  updateJobStatus,
} from "./jobs.controller.js";

const router = express.Router();

router.post(
  "/",
  auth(Role.EMPLOYER),
  validateRequest(createNewJobValidationSchema),
  createNewJob,
);

router.get("/", getAllJobs);

router.get("/:id", getJobById);

router.post(
  "/:jobId/apply",
  auth(Role.FREELANCER),
  validateRequest(applyJobValidationSchema),
  createJobApplication,
);

router.get(
  "/:jobId/applications",
  auth(Role.EMPLOYER),
  getAllApplicationByJobId,
);

router.patch(
  "/applications/:applicationId/status",
  auth(Role.EMPLOYER),
  validateRequest(updateApplicationStatusValidationSchema),
  updateApplicationStatus,
);

router.patch(
  "/:jobId/status",
  auth(Role.EMPLOYER),
  validateRequest(updateJobStatusValidationSchema),
  updateJobStatus,
);

const JobRouters = router;
export default JobRouters;
