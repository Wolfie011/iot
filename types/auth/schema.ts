import { z } from "zod";
import { usernameSchema, passwordSchema } from "@/types/shared/zod";

/**
 * Schema: Sign In
 */
export const signInSchema = z.object({
  userName: usernameSchema.describe("User's login name"),
  password: passwordSchema.describe("User's password"),
});

/**
 * Schema: Sign Up (with password confirmation)
 */
export const signUpSchema = z
  .object({
    userName: usernameSchema.describe("Username used to log in"),
    firstName: z
      .string()
      .min(1, "First name is required")
      .describe("User's first name"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .describe("User's last name"),
    email: z
      .string()
      .email("Invalid email address")
      .describe("User's email address"),
    password: passwordSchema.describe("Password for the account"),
    confirmPassword: passwordSchema.describe("Password confirmation"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Schema: Account Activation (set password)
 */
export const activationSchema = z
  .object({
    password: passwordSchema.describe("New password to activate account"),
    confirmPassword: passwordSchema.describe("Password confirmation"),
    pin: z
      .string()
      .optional()
      .describe("6-digit numeric PIN code for verification")
      .refine(
        (val) => !val || /^\d{6}$/.test(val),
        "PIN musi zawierać dokładnie 6 cyfr i tylko cyfry"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same",
    path: ["confirmPassword"],
  });
