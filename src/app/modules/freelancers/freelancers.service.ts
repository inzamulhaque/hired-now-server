import type { JwtPayload } from "jsonwebtoken";
import type { IFreelancer } from "./freelancers.interface.js";
import AppError from "../../utils/AppError.js";
import { Role } from "../../../generated/enums.js";
import prisma from "../../../lib/prisma.js";

export const createOrUpdateFreelancerProfileIntoDB = async (
  loggedUser: JwtPayload,
  payload: Partial<IFreelancer>,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: loggedUser.userId,
      role: Role.FREELANCER,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const freelancer = await prisma.freelancerProfile.findFirst({
    where: {
      userId: user.id,
    },
  });

  //   validation for skills
  if (!freelancer && !payload?.skills) {
    throw new AppError(
      "Skills are required to create a freelancer profile.",
      400,
    );
  }

  let skills = freelancer?.skills || null;

  if (payload?.skills && typeof payload.skills === "string") {
    skills = payload?.skills.split(",").map((skill) => skill.trim());
  }

  //   check freelancer profile exits or not
  if (!freelancer) {
    const profile = await prisma.freelancerProfile.create({
      data: {
        userId: user.id,
        ...payload,
        skills: skills as string[],
      },
    });

    return profile;
  }

  const profile = await prisma.freelancerProfile.update({
    where: {
      id: freelancer.id,
      userId: user.id,
    },
    data: {
      ...payload,
      skills: skills as string[],
    },
  });

  return profile;
};

export const getFreelancerProfileFromDB = async (loggedUser: JwtPayload) => {
  const user = await prisma.user.findFirst({
    where: {
      id: loggedUser.userId,
      role: Role.FREELANCER,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const freelancer = await prisma.freelancerProfile.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!freelancer) {
    throw new AppError("Freelancer profile not found!", 404);
  }

  return freelancer;
};
