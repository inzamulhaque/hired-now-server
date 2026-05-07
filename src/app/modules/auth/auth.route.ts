import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { createUserValidationSchema } from "./auth.validation.js";
import { createNewAccount } from "./auth.controller.js";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(createUserValidationSchema),
  createNewAccount,
);

const AuthRouters = router;
export default AuthRouters;
