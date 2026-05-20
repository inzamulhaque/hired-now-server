import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { createNewAdminValidationSchema } from "./superAdmin.validation.js";
import {
  bannedAdmin,
  createNewAdmin,
  reactivateAdminAccount,
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

router.patch(
  "/reactivate-admin/:adminId",
  auth(Role.SUPER_ADMIN),
  reactivateAdminAccount,
);

router.patch("/banned-admin/:adminId", auth(Role.SUPER_ADMIN), bannedAdmin);

const SuperAdminRouters = router;
export default SuperAdminRouters;
