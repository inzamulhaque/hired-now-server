import { z } from "zod";
import { AccountStatus, Role } from "../../../generated/enums.js";

export const createUserValidationSchema = z.object({
  body: z.object({
    email: z.templateLiteral([z.string().min(1), "@", z.string().max(64)]),

    name: z
      .string()
      .trim()
      .min(2, {
        error: "Name must be at least 2 characters long",
      })
      .max(50, {
        error: "Name cannot exceed 50 characters",
      }),

    password: z
      .string()
      .min(6, {
        error: "Password must be at least 6 characters long",
      })
      .max(12, {
        error: "Password cannot exceed 12 characters",
      })
      .regex(/[A-Z]/, {
        error: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        error: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        error: "Password must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        error: "Password must contain at least one special character",
      }),

    role: z.enum(Role),

    status: z
      .enum(AccountStatus)
      .optional()
      .default(AccountStatus.PENDING_VERIFICATION),
  }),
});

export const signinUserValidationSchema = z.object({
  body: z.object({
    email: z.templateLiteral([z.string().min(1), "@", z.string().max(64)]),

    password: z.string().min(1, {
      error: "Password is required!",
    }),
  }),
});

export const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, {
      error: "Password is required!",
    }),

    newPassword: z
      .string()
      .min(6, {
        error: "Password must be at least 6 characters long",
      })
      .max(12, {
        error: "Password cannot exceed 12 characters",
      })
      .regex(/[A-Z]/, {
        error: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        error: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        error: "Password must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        error: "Password must contain at least one special character",
      }),
  }),
});
