import { Router } from "express";
import AuthRouters from "../app/modules/auth/auth.route.js";
import UserRouters from "../app/modules/users/user.route.js";
import FreelancerRouters from "../app/modules/freelancers/freelancers.route.js";
import JobRouters from "../app/modules/jobs/jobs.route.js";

const router = Router();

const moduleRouters = [
  {
    path: "/auth",
    route: AuthRouters,
  },

  {
    path: "/user",
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
];

moduleRouters.forEach(({ path, route }) => router.use(path, route));

export default router;
