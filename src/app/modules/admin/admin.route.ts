import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import { getAllUser } from "./admin.controller.js";

const router = express.Router();

router.get("/users", auth(Role.ADMIN, Role.SUPER_ADMIN), getAllUser);

const AdminRouters = router;
export default AdminRouters;
