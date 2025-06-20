import type { ZodSchema } from "zod";

export interface ActionResult<T = unknown> {
  state?: "success" | "error";
  data?: T;
  success?: string;
  error?: string;
  message?: string;
}

export type ActionResultGeneric<T = unknown> = ActionResult<T>;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validates input using a Zod schema. Throws a structured ValidationError if invalid.
 */
export function validate<T>(schema: ZodSchema<T>, values: unknown): T {
  const result = schema.safeParse(values);
  if (!result.success) {
    throw new ValidationError(
      JSON.stringify(result.error.flatten().fieldErrors)
    );
  }
  return result.data;
}
