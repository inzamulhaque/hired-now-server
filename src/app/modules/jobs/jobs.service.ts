import type { JwtPayload } from "jsonwebtoken";
import type { IJob, IJobApplication } from "./jobs.interface.js";
import {
  ApplicationStatus,
  JobStatus,
  NotificationType,
  PaymentStatus,
  Role,
} from "../../../generated/enums.js";
import prisma from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import type { ISearchParams } from "../../utils/buildSearchQuery.js";
import buildSearchQuery from "../../utils/buildSearchQuery.js";
import type { Prisma } from "../../../generated/client.js";
import calTotalPages from "../../utils/calTotalPages.js";
import { getIO } from "../../../socket/index.js";
import { aiMatchScoreService } from "../AI/ai.service.js";
import { Decimal } from "@prisma/client/runtime/client";

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

export const getJobByIdFromDB = async (jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new AppError("Job not found!", 404);
  }

  return job;
};

export const createJobApplicationIntoDB = async (
  loggedUser: JwtPayload,
  jobId: string,

  applicationData: Omit<
    IJobApplication,
    "id" | "jobId" | "freelancerId" | "status" | "aiMatchScore" | "aiNote"
  >,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: loggedUser.id,
      role: Role.FREELANCER,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const freelancer = await prisma.freelancerProfile.findFirst({
    where: { userId: user.id },
  });

  // need complete freelancer profile for applying jobs
  if (!freelancer) {
    throw new AppError("Freelancer profile not completed!", 400);
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new AppError("Job not found!", 404);
  }

  // validated this job open for applications or not
  if (job.status !== JobStatus.OPEN) {
    throw new AppError("Cannot apply to a job that is not open!", 400);
  }

  const alreadyApplied = await prisma.application.findFirst({
    where: {
      jobId,
      freelancerId: loggedUser.id,
    },
  });

  // validated freelancer already applied or not
  if (alreadyApplied) {
    throw new AppError("You have already applied to this job!", 400);
  }

  // application reviews and scoring with AI
  const aiInput = {
    title: job.title,
    skillsRequired: job.skillsRequired,
    freelancerSkills: freelancer.skills,
    coverNote: applicationData.coverNote,
    proposedBudget: applicationData.proposedBudget,
    jobBudget: job.budget,
  };

  const aiMatchScore = await aiMatchScoreService(aiInput);

  // create application
  const application = await prisma.$transaction(async (tc) => {
    const result = await tc.application.create({
      data: {
        jobId: job.id,
        freelancerId: user.id,
        coverNote: applicationData.coverNote,
        proposedBudget: new Decimal(applicationData.proposedBudget.toFixed(2)),
        status: ApplicationStatus.PENDING,
        aiMatchScore: Number(aiMatchScore?.aiMatchScore.toFixed(2)),
        aiNote: aiMatchScore?.aiNote,
      },
    });

    const notification = await tc.notification.create({
      data: {
        userId: job.employerId,
        type: NotificationType.NEW_APPLICATION,
        title: "New Application Received",
        body: `You have received a new application for your job "${job.title}".`,
      },
    });

    return { ...result, notification };
  });

  // realtime notification
  const io = getIO();

  io.to(job.employerId).emit("newApplication", {
    message: "A new freelancer applied to your job!",

    data: {
      id: application.notification.id,
      type: application.notification.type,
      title: application.notification.title,
      body: application.notification.body,
      isRead: false,
    },
  });

  return application;
};

export const getAllApplicationByJobIdFromDB = async (
  loggedUser: JwtPayload,
  jobId: string,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: loggedUser.id,
      role: Role.EMPLOYER,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new AppError("Job not found!", 404);
  }

  if (job.employerId !== user.id) {
    throw new AppError(
      "You are not authorized to view applications for this job!",
      403,
    );
  }

  const applications = await prisma.application.findMany({
    where: {
      jobId,
    },
    include: {
      freelancer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return applications;
};

export const updateApplicationStatusIntoDB = async (
  loggedUser: JwtPayload,
  applicationId: string,
  status: ApplicationStatus,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: loggedUser.id,
      role: Role.EMPLOYER,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    throw new AppError("Application not found!", 404);
  }

  const job = await prisma.job.findFirst({
    where: {
      id: application.jobId,
    },
  });

  if (!job) {
    throw new AppError("Job not found!", 404);
  }

  if (job.employerId !== user.id) {
    throw new AppError(
      "You are not authorized to update applications Status for this job!",
      403,
    );
  }

  const updatedApplication = await prisma.$transaction(async (tc) => {
    const updated = await tc.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
      },
    });

    let notification = null;

    // status change to HIRED then automatically reject others applications and job status also change to FILLED
    if (status === ApplicationStatus.HIRED) {
      notification = await tc.notification.create({
        data: {
          userId: application.freelancerId,
          type: NotificationType.HIRED,
          title: "Application Accepted",
          body: `Congratulations! Your application for the job "${job.title}" has been accepted.`,
        },
      });

      await tc.application.updateMany({
        where: {
          jobId: application.jobId,
          id: { not: applicationId },
        },
        data: {
          status: ApplicationStatus.REJECTED,
        },
      });

      await tc.job.update({
        where: {
          id: application.jobId,
        },
        data: {
          status: JobStatus.FILLED,
        },
      });
    }
    return { ...updated, notification };
  });

  // realtime notification
  if (updatedApplication.notification) {
    const io = getIO();

    io.to(application.freelancerId).emit("application:hired", {
      message: "You have been hired!",

      data: {
        id: updatedApplication.notification.id,
        type: updatedApplication.notification.type,
        title: updatedApplication.notification.title,
        body: updatedApplication.notification.body,
        isRead: false,
      },
    });
  }

  return updatedApplication;
};

export const updateJobStatusIntoDB = async (
  loggedUser: JwtPayload,
  jobId: string,
  status: JobStatus,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: loggedUser.id,
      role: Role.EMPLOYER,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new AppError("Job not found!", 404);
  }

  if (job.employerId !== user.id) {
    throw new AppError(
      "You are not authorized to update status for this job!",
      403,
    );
  }

  if (job.status !== JobStatus.FILLED) {
    throw new AppError("You can only update the status of a filled job!", 400);
  }

  if (status !== JobStatus.CLOSED) {
    throw new AppError("Job status can only be updated to CLOSED!", 400);
  }

  const updatedJobStatus = await prisma.job.update({
    where: { id: jobId },
    data: { status },
  });

  return updatedJobStatus;
};
