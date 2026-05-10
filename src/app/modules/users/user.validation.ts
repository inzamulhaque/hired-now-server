import z from "zod";
import { AccountStatus } from "../../../generated/enums.js";

export const updateUserInfoValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),

    status: z
      .enum(AccountStatus)
      .optional()
      .refine((value) => !value || value === "ACTIVE" || value === "INACTIVE", {
        message: "Status can only be ACTIVE or INACTIVE",
      }),
  }),
});
