import z from "zod";
import {
  ApplicationStatus,
  JobStatus,
  JobType,
} from "../../../generated/enums.js";

export const createNewJobValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required!")
      .max(100, "Title must be less than 100 characters!"),
    description: z
      .string()
      .min(1, "Description is required!")
      .max(2000, "Description must be less than 2000 characters!"),
    skillsRequired: z.string().min(1, "Skills are required!"),
    budget: z.number().positive("Budget must be a positive number!"),
    jobType: z.enum(JobType, "Job type must be either FIXED or HOURLY!"),
  }),
});

export const applyJobValidationSchema = z.object({
  body: z.object({
    coverNote: z
      .string()
      .trim()
      .min(20, "Cover note must be at least 20 characters")
      .max(1000, "Cover note cannot exceed 1000 characters"),

    proposedBudget: z
      .number()
      .positive("Proposed budget must be greater than 0"),
  }),
});

export const updateApplicationStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(
      ApplicationStatus,
      "Status must be either REVIEWED, SHORTLISTED, HIRED, or REJECTED!",
    ),
  }),
});

export const updateJobStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(JobStatus, "Status must be either OPEN, FILLED, or CLOSED!"),
  }),
});
