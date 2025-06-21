import { z } from "zod";

export const updateUserSchema = z.object({
  id: z.string().describe("Unique identifier of the user"),

  userName: z
    .string()
    .min(1, "Username is required")
    .describe("Username used for logging in")
    .optional(),

  firstName: z
    .string()
    .min(1, "First name is required")
    .describe("User's first name")
    .optional(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .describe("User's last name")
    .optional(),

  email: z
    .string()
    .email("Invalid email address")
    .describe("User's email address")
    .optional(),

  phone: z
    .string()
    .describe("Optional phone number")
    .optional(),

  roleJob: z
    .array(
      z.object({
        value: z.string().describe("RoleJob ID"),
        label: z.string().describe("Display name of the RoleJob"),
      })
    )
    .describe("List of assigned role jobs")
    .optional(),

  permissionRole: z
    .array(
      z.object({
        value: z.string().describe("PermissionRole ID"),
        label: z.string().describe("Display name of the PermissionRole"),
      })
    )
    .describe("List of assigned permission roles")
    .optional(),
});
