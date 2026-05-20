import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import { getAllUser, suspendUser } from "./admin.controller.js";

const router = express.Router();

router.get("/users", auth(Role.ADMIN, Role.SUPER_ADMIN), getAllUser);

router.patch(
  "/suspend-user/:userId",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  suspendUser,
);

const AdminRouters = router;
export default AdminRouters;
