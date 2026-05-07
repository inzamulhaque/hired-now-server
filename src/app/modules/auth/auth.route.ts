import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { createUserValidationSchema } from "./auth.validation.js";
import { createNewEmployer } from "./auth.controller.js";

const router = express.Router();

router.post(
  "/employer/signup",
  validateRequest(createUserValidationSchema),
  createNewEmployer,
);

const AuthRouters = router;
export default AuthRouters;
