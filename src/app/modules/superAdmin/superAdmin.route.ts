import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { createNewAdminValidationSchema } from "./superAdmin.validation.js";
import {
  createNewAdmin,
  suspendAdminAccount,
} from "./superAdmin.controller.js";

const router = express.Router();

router.post(
  "/create-admin",
  auth(Role.SUPER_ADMIN),
  validateRequest(createNewAdminValidationSchema),
  createNewAdmin,
);

router.patch(
  "/suspend-admin/:adminId",
  auth(Role.SUPER_ADMIN),
  suspendAdminAccount,
);

const SuperAdminRouters = router;
export default SuperAdminRouters;
