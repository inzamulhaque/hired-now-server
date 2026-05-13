import type { JwtPayload } from "jsonwebtoken";
import type { IJob } from "./jobs.interface.js";
import { JobStatus, Role } from "../../../generated/enums.js";
import prisma from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import type { ISearchParams } from "../../utils/buildSearchQuery.js";
import buildSearchQuery from "../../utils/buildSearchQuery.js";
import type { Prisma } from "../../../generated/client.js";
import calTotalPages from "../../utils/calTotalPages.js";

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

export const getAllJobsFromDB = async (payload: ISearchParams) => {
  const { where, skip, take, orderBy, page } = buildSearchQuery<
    Prisma.JobWhereInput,
    Prisma.JobOrderByWithRelationInput
  >(payload);

  const jobs = await prisma.job.findMany({
    where,
    skip,
    take,
    orderBy,
  });

  const totalJobs = await prisma.job.count({ where });
  const totalPages = calTotalPages(totalJobs, take);

  if (totalPages !== 0 && totalJobs < page) {
    throw new AppError("Page number exceeds total pages available!", 400);
  }

  return {
    jobs,
    meta: {
      page: Number(page),
      total: totalJobs,
      totalPages,
    },
  };
};
