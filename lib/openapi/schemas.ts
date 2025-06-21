import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  signInSchema,
  signUpSchema,
  activationSchema,
} from "@/types/auth/schema";
import { updateUserSchema } from "@/types/user/schema";

extendZodWithOpenApi(z);

// rejestruj wszystkie schematy
export const registry = new OpenAPIRegistry();
registry.register("SignInInput", signInSchema);
registry.register("SignUpInput", signUpSchema);
registry.register("ActivationInput", activationSchema);
registry.register("UpdateUserInput", updateUserSchema);
