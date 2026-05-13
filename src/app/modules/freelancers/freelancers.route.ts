import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { freelancerProfileValidationSchema } from "./freelancers.validation.js";
import {
  createOrUpdateFreelancerProfile,
  getFreelancerProfile,
} from "./freelancers.controller.js";

const router = express.Router();

router.put(
  "/profile",
  auth(Role.FREELANCER),
  validateRequest(freelancerProfileValidationSchema),
  createOrUpdateFreelancerProfile,
);

router.get("/profile", auth(Role.FREELANCER), getFreelancerProfile);

const FreelancerRouters = router;
export default FreelancerRouters;
