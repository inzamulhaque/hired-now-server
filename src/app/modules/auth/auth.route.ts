import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  changePasswordValidationSchema,
  createUserValidationSchema,
  forgotPasswordValidationSchema,
  resendOtpValidationSchema,
  resetPasswordValidationSchema,
  signinUserValidationSchema,
  verifyAccountValidationSchema,
} from "./auth.validation.js";
import {
  changePassword,
  createNewAccount,
  forgotPassword,
  resendOtp,
  resetPassword,
  signin,
  signOutUser,
  verifyAccount,
  verifyResetOtp,
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

router.post(
  "/verify-account",
  validateRequest(verifyAccountValidationSchema),
  verifyAccount,
);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordValidationSchema),
  forgotPassword,
);

router.post(
  "/verify-reset-otp",
  validateRequest(verifyAccountValidationSchema),
  verifyResetOtp,
);

router.patch(
  "/reset-password",
  auth(Role.ADMIN, Role.EMPLOYER, Role.FREELANCER, Role.SUPER_ADMIN),
  validateRequest(resetPasswordValidationSchema),
  resetPassword,
);

const AuthRouters = router;
export default AuthRouters;
