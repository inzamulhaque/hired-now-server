import z from "zod";

export const enhancedDescriptionValidationSchema = z.object({
  body: z.object({
    description: z
      .string({})
      .min(1, "Description cannot be empty")
      .max(2000, "Description must be less than 2000 characters"),

    skillsRequired: z.string({}).min(1, "Skills cannot be empty"),
  }),
});
