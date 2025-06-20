import { InferSelectModel } from "drizzle-orm";
import { userTable, roleJobTable } from "@/lib/database/schema";
import { updateUserSchema } from "./schema";
import { z } from "zod";

// Główny model użytkownika (z bazy danych)
export type User = InferSelectModel<typeof userTable>;

// Użytkownik bez hasła
export type PublicUser = Omit<User, "hashedPassword" | "hashedPin">;

// Dane wejściowe do update'u (z react-hook-form)
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// DTO do przesyłania pełnych danych użytkownika z rolami
export type UserDTO = Omit<
  User,
  "hashedPassword" | "hashedPin" | "createdAt" | "updatedAt"
> & {
  roleJob: { id: string; tag: string }[];
  permissionRole: { id: string; tag: string }[];
};

// Rola robocza (powiązana z jednostką lub odpowiedzialnością)
export type RoleJob = InferSelectModel<typeof roleJobTable>;
