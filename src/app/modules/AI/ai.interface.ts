import type { Decimal } from "@prisma/client/runtime/client";

export interface IEnhancedDescription {
  description: string;
  skillsRequired: string;
}

export interface IAIMatchInput {
  title: string;
  skillsRequired: string[];
  freelancerSkills: string[];
  coverNote: string;
  proposedBudget: Decimal;
  jobBudget: Decimal;
}
