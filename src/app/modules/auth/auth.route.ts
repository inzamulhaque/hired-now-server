import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  changePasswordValidationSchema,
  createUserValidationSchema,
  signinUserValidationSchema,
} from "./auth.validation.js";
import { changePassword, createNewAccount, signin } from "./auth.controller.js";
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

const AuthRouters = router;
export default AuthRouters;
