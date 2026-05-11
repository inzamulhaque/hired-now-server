import { z } from "zod";

export const freelancerProfileValidationSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters long",
    })
    .max(100, {
      message: "Title cannot exceed 100 characters",
    })
    .optional(),

  bio: z
    .string()
    .max(1000, {
      message: "Bio cannot exceed 1000 characters",
    })
    .optional(),

  skills: z
    .union([
      z.string().min(1, {
        message: "Skills cannot be empty",
      }),

      z
        .array(
          z.string().min(1, {
            message: "Each skill must be a valid string",
          }),
        )
        .min(1, {
          message: "At least one skill is required",
        }),
    ])
    .optional(),

  hourlyRate: z
    .number({})
    .positive({
      message: "Hourly rate must be greater than 0",
    })
    .optional(),

  availability: z.boolean().default(true).optional(),
});
