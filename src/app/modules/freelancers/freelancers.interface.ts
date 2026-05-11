import type { Decimal } from "@prisma/client/runtime/client";

export interface IFreelancer {
  id: string;
  userId: string;
  title?: string;
  bio?: string;
  skills: string | string[];
  hourlyRate?: Decimal;
  availability: boolean;
}
