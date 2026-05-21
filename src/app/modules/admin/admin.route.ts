import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import {
  bannedUser,
  getAllUser,
  getSummaryStats,
  reactivateSuspendedUser,
  suspendUser,
} from "./admin.controller.js";

const router = express.Router();

router.get("/users", auth(Role.ADMIN, Role.SUPER_ADMIN), getAllUser);

router.patch(
  "/suspend-user/:userId",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  suspendUser,
);

router.patch(
  "/reactivate-user/:userId",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  reactivateSuspendedUser,
);

router.patch(
  "/ban-user/:userId",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  bannedUser,
);

router.get(
  "/summary-stats",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  getSummaryStats,
);

const AdminRouters = router;
export default AdminRouters;
