import z from "zod";

export const createNewAdminValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z.templateLiteral([z.string().min(1), "@", z.string().max(64)]),
  }),
});
