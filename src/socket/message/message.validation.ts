import z from "zod";

export const sendMessageValidationSchema = z.object({
  receiverId: z.string().uuid("Invalid receiver ID"),

  content: z
    .string()
    .trim()
    .min(1, "Message content is required")
    .max(1000, "Message cannot exceed 1000 characters"),
});
