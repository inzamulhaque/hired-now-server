import type { Decimal } from "@prisma/client/runtime/client";
import type {
  ApplicationStatus,
  JobStatus,
  JobType,
} from "../../../generated/enums.js";

export interface IJob {
  id: string;
  employerId: string;
  title: string;
  description: string;
  skillsRequired: string[] | string;
  budget: Decimal;
  jobType: JobType;
  status: JobStatus;
  aiEnhanced: boolean;
}

export interface IJobApplication {
  id: string;
  jobId: string;
  freelancerId: string;
  coverNote: string;
  status: ApplicationStatus;
  aiMatchScore?: number;
  aiNote?: string;
  proposedBudget: Decimal;
}
