import { auth } from "@/lib/lucia";
import { cookies } from "next/headers";
import db from "@/lib/database";
import { and, eq } from "drizzle-orm";
import {
  userRoleTable,
  roleTable,
  rolePermissionTable,
  permissionTable,
} from "@/lib/database/schema";
import { ActionResultGeneric } from "@/types/shared/action-result";
import { ValidationError } from "@/types/shared/action-result";

/**
 * Enables or disables RBAC permission checks globally via env var.
 */
const isPermissionEnabled = process.env.PERMISSION_ENABLED === "true";

/**
 * Authorizes a user based on session cookie (Lucia).
 * Returns `{ user, session }` or `{ user: null, session: null }`.
 */
export async function authorize() {
  const sessionId = cookies().get("auth_session")?.value ?? "";
  return auth.validateSession(sessionId);
}

/**
 * Checks if a user has a given permission via role-permission mapping.
 * Returns `true` if permission found, otherwise `false`.
 */
export async function hasPermission(
  userId: string,
  requiredPermission: string
): Promise<boolean> {
  if (!isPermissionEnabled) return true;

  const result = await db
    .select()
    .from(userRoleTable)
    .innerJoin(roleTable, eq(roleTable.id, userRoleTable.roleId))
    .innerJoin(rolePermissionTable, eq(rolePermissionTable.roleId, roleTable.id))
    .innerJoin(permissionTable, eq(permissionTable.id, rolePermissionTable.permissionId))
    .where(
      and(
        eq(userRoleTable.userId, userId),
        eq(permissionTable.name, requiredPermission)
      )
    )
    .limit(1);

  return result.length > 0;
}

/**
 * Wraps server action logic with standardized error handling.
 */
export default async function wrap<T = unknown>(
  fn: () => Promise<ActionResultGeneric<T>>
): Promise<ActionResultGeneric<T>> {
  try {
    return await fn();
  } catch (e) {
    console.error("❌ Action failed:", e);
    return {
      state: "error",
      error: e instanceof ValidationError ? e.message : "Unexpected error",
    };
  }
}
