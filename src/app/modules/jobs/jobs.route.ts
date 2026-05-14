import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  applyJobValidationSchema,
  createNewJobValidationSchema,
} from "./jobs.validation.js";
import {
  createJobApplication,
  createNewJob,
  getAllJobs,
  getJobById,
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

const JobRouters = router;
export default JobRouters;
