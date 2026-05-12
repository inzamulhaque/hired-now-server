import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { enhancedDescriptionValidationSchema } from "./ai.validation.js";
import { enhanceDescription } from "./ai.controller.js";

const router = express.Router();

router.post(
  "/generate-job-description",
  auth(Role.EMPLOYER),
  validateRequest(enhancedDescriptionValidationSchema),
  enhanceDescription,
);

const AIRouters = router;
export default AIRouters;
