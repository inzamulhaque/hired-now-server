import type { JwtPayload } from "jsonwebtoken";
import type { IJob } from "./jobs.interface.js";
import { JobStatus, Role } from "../../../generated/enums.js";
import prisma from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export const createNewJobIntoDB = async (
  loggedUser: JwtPayload,
  jobData: Omit<IJob, "id" | "employerId" | "status">,
) => {
  const user = await prisma.user.findFirst({
    where: { id: loggedUser.id, role: Role.EMPLOYER },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  let skills;

  if (jobData?.skillsRequired && typeof jobData.skillsRequired === "string") {
    skills = jobData?.skillsRequired.split(",").map((skill) => skill.trim());
  }

  //   validation for skills
  if (!skills) {
    throw new AppError("Skills are required to create a job!", 400);
  }

  const job = await prisma.job.create({
    data: {
      employerId: user.id,
      ...jobData,
      skillsRequired: skills as string[],
      status: JobStatus.OPEN,
    },
  });

  return job;
};
