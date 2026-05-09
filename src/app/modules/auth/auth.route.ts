import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  changePasswordValidationSchema,
  createUserValidationSchema,
  resendOtpValidationSchema,
  signinUserValidationSchema,
} from "./auth.validation.js";
import {
  changePassword,
  createNewAccount,
  resendOtp,
  signin,
  signOutUser,
} from "./auth.controller.js";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(createUserValidationSchema),
  createNewAccount,
);

router.post("/signin", validateRequest(signinUserValidationSchema), signin);

router.patch(
  "/change-password",
  auth(Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYER, Role.FREELANCER),
  validateRequest(changePasswordValidationSchema),
  changePassword,
);

router.post("/signout", signOutUser);

router.post(
  "/resend-otp",
  validateRequest(resendOtpValidationSchema),
  resendOtp,
);

const AuthRouters = router;
export default AuthRouters;
