import { Router } from "express";
import AuthRouters from "../app/modules/auth/auth.route.js";
import UserRouters from "../app/modules/users/user.route.js";
import FreelancerRouters from "../app/modules/freelancers/freelancers.route.js";
import JobRouters from "../app/modules/jobs/jobs.route.js";
import AIRouters from "../app/modules/AI/ai.route.js";
import AdminRouters from "../app/modules/admin/admin.route.js";

const router = Router();

const moduleRouters = [
  {
    path: "/auth",
    route: AuthRouters,
  },

  {
    path: "/users",
    route: UserRouters,
  },

  {
    path: "/freelancers",
    route: FreelancerRouters,
  },

  {
    path: "/jobs",
    route: JobRouters,
  },

  {
    path: "/ai",
    route: AIRouters,
  },

  {
    path: "/admin",
    route: AdminRouters,
  },
];

moduleRouters.forEach(({ path, route }) => router.use(path, route));

export default router;
