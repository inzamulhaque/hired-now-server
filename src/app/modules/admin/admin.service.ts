import type { JwtPayload } from "jsonwebtoken";
import {
  AccountStatus,
  ApplicationStatus,
  JobStatus,
  Role,
} from "../../../generated/enums.js";
import AppError from "../../utils/AppError.js";
import prisma from "../../../lib/prisma.js";
import type { ISearchParams } from "../../utils/buildSearchQuery.js";
import buildSearchQuery from "../../utils/buildSearchQuery.js";
import type { Prisma } from "../../../generated/client.js";
import calTotalPages from "../../utils/calTotalPages.js";

export const getAllUserFromDB = async (
  loggedUser: JwtPayload,
  payload: ISearchParams,
) => {
  const { where, skip, take, orderBy, page } = buildSearchQuery<
    Prisma.UserWhereInput,
    Prisma.UserOrderByWithRelationInput
  >(payload);

  if (loggedUser.role !== Role.ADMIN && loggedUser.role !== Role.SUPER_ADMIN) {
    throw new AppError("Unauthorized!", 401);
  }

  const users = await prisma.user.findMany({
    where: {
      ...where,
      OR: [{ role: Role.EMPLOYER }, { role: Role.FREELANCER }],
    },

    skip,
    take: Number(take),
    orderBy,

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const totalUser = await prisma.user.count({
    where: {
      ...where,
      OR: [{ role: Role.EMPLOYER }, { role: Role.FREELANCER }],
    },
  });
  const totalPages = calTotalPages(totalUser, take);

  if (totalPages !== 0 && totalUser < page) {
    throw new AppError("Page number exceeds total pages available!", 400);
  }

  return {
    users,
    meta: {
      page: Number(page),
      total: totalUser,
      totalPages,
    },
  };
};

export const suspendUserIntoDB = async (
  loggedUser: JwtPayload,
  userId: string,
) => {
  const admin = await prisma.user.findUnique({
    where: {
      id: loggedUser.userId,
    },
  });

  if (
    !admin ||
    (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN)
  ) {
    throw new AppError("Unauthorized!", 401);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
    throw new AppError("Cannot suspend an admin user!", 403);
  }

  if (
    user.status !== AccountStatus.ACTIVE &&
    user.status !== AccountStatus.INACTIVE
  ) {
    throw new AppError("User is not active or inactive!", 400);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: AccountStatus.SUSPENDED,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};

export const reactivateSuspendedUserIntoDB = async (
  loggedUser: JwtPayload,
  userId: string,
) => {
  const admin = await prisma.user.findUniqueOrThrow({
    where: {
      id: loggedUser.userId,
    },
  });

  if (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN) {
    throw new AppError("Unauthorized!", 401);
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (user.status !== AccountStatus.SUSPENDED) {
    throw new AppError("User is not suspended!", 400);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: AccountStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};

export const bannedUserIntoDB = async (
  loggedUser: JwtPayload,
  userId: string,
) => {
  const admin = await prisma.user.findUniqueOrThrow({
    where: {
      id: loggedUser.userId,
    },
  });

  if (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN) {
    throw new AppError("Unauthorized!", 401);
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
    throw new AppError("Cannot ban an admin user!", 403);
  }

  if (
    user.status !== AccountStatus.ACTIVE &&
    user.status !== AccountStatus.INACTIVE
  ) {
    throw new AppError("User is not active or inactive!", 400);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: AccountStatus.BANNED,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};

export const getSummaryStatsFromDB = async (loggedUser: JwtPayload) => {
  if (loggedUser.role !== Role.ADMIN && loggedUser.role !== Role.SUPER_ADMIN) {
    throw new AppError("Unauthorized!", 401);
  }

  const totalEmployers = await prisma.user.count({
    where: {
      role: Role.EMPLOYER,
    },
  });

  const totalFreelancers = await prisma.user.count({
    where: {
      role: Role.FREELANCER,
    },
  });

  const totalActiveProjects = await prisma.job.count({
    where: {
      status: JobStatus.OPEN,
    },
  });

  const totalClosedProjects = await prisma.job.count({
    where: {
      status: JobStatus.CLOSED,
    },
  });

  const totalHires = await prisma.application.count({
    where: {
      status: ApplicationStatus.HIRED,
    },
  });

  return {
    totalEmployers,
    totalFreelancers,
    totalActiveProjects,
    totalClosedProjects,
    totalHires,
  };
};
