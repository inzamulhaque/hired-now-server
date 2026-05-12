import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { createNewJobValidationSchema } from "./jobs.validation.js";
import { createNewJob } from "./jobs.controller.js";

const router = express.Router();

router.post(
  "/",
  auth(Role.EMPLOYER),
  validateRequest(createNewJobValidationSchema),
  createNewJob,
);

const JobRouters = router;
export default JobRouters;
