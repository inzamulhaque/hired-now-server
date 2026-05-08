import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  createUserValidationSchema,
  signinUserValidationSchema,
} from "./auth.validation.js";
import { createNewAccount, signin } from "./auth.controller.js";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(createUserValidationSchema),
  createNewAccount,
);

router.post("/signin", validateRequest(signinUserValidationSchema), signin);

const AuthRouters = router;
export default AuthRouters;
