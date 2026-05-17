import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { updateUserInfoValidationSchema } from "./user.validation.js";
import { getMyProfile, updateUserInfo } from "./user.controller.js";

const router = express.Router();

router.get(
  "/profile",
  auth(Role.ADMIN, Role.EMPLOYER, Role.FREELANCER, Role.SUPER_ADMIN),
  getMyProfile,
);

router.patch(
  "/profile",
  auth(Role.ADMIN, Role.EMPLOYER, Role.FREELANCER, Role.SUPER_ADMIN),
  validateRequest(updateUserInfoValidationSchema),
  updateUserInfo,
);

const UserRouters = router;
export default UserRouters;
