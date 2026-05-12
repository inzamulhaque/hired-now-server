import type { Decimal } from "@prisma/client/runtime/client";
import type { JobStatus, JobType } from "../../../generated/enums.js";

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
