import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(32, "Username must be at most 32 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
  .describe("Username used for logging in. Must be 3–32 characters and contain only letters, numbers, and underscores.");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be at most 100 characters")
  .describe("Password used for authentication. Must be 8–100 characters long.");

export default function validate<T>(schema: ZodSchema<T>, values: unknown): T {
	const result = schema.safeParse(values);
	if (!result.success) {
		// Return errors in a structured way
		throw new ValidationError(
			JSON.stringify(result.error.flatten().fieldErrors),
		);
	}
	return result.data;
}