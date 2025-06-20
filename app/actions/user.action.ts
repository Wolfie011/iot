"use server";

import { eq, inArray } from "drizzle-orm";
import db from "@/lib/database";
import {
  userTable,
  roleJobUserTable,
  roleJobTable,
  userRoleTable,
  roleTable,
} from "@/lib/database/schema";
import wrap, { authorize, hasPermission } from "@/lib/server-utils";
import { ActionResultGeneric } from "@/types/shared/action-result";
import { SignUpInput } from "@/types/auth/types";
import { signUpSchema } from "@/types/auth/schema";
import validate from "@/types/shared/zod";
import bcrypt from "bcryptjs";
import { UpdateUserInput, UserDTO } from "@/types/user/types";
import { updateUserSchema } from "@/types/user/schema";

const BCRYPT_SALT_ROUNDS = 12;

export const createUser = async (
  input: SignUpInput
): Promise<ActionResultGeneric<UserDTO>> =>
  wrap(async () => {
    const requiredPermission = "user:create";
    const { user: authUser } = await authorize();
    if (!authUser) return { state: "error", error: "Authentication required" };
    if (!(await hasPermission(authUser.id, requiredPermission)))
      return { state: "error", error: "Insufficient permissions" };

    const { userName, firstName, lastName, email, password } =
      validate(signUpSchema, input) as SignUpInput;

    const exists = await db.query.userTable.findFirst({
      where: (t) => eq(t.userName, userName),
    });
    if (exists) return { state: "error", error: "Username already taken" };

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const [inserted] = await db
      .insert(userTable)
      .values({
        userName,
        firstName,
        lastName,
        email,
        hashedPassword,
      })
      .returning({ id: userTable.id });

    if (!inserted?.id)
      return { state: "error", error: "Failed to create user" };

    const newUserResult = await getUserById(inserted.id);
    if (newUserResult.state !== "success" || !newUserResult.data)
      return { state: "error", error: "Failed to fetch created user data" };

    return {
      state: "success",
      success: "Account created successfully",
      data: newUserResult.data,
    };
  });

export const getUserById = async (
  id: string
): Promise<ActionResultGeneric<UserDTO>> =>
  wrap(async () => {
    const requiredPermission = "user:read";
    const { user: authUser } = await authorize();
    if (!authUser) return { state: "error", error: "Authentication required" };
    if (!(await hasPermission(authUser.id, requiredPermission)))
      return { state: "error", error: "Insufficient permissions" };

    return await db.transaction(async (tx) => {
      const userRow = await tx.query.userTable.findFirst({
        where: (u) => eq(u.id, id),
      });
      if (!userRow) return { state: "error", error: "User not found" };

      const roleJobRows = await tx
        .select({
          userId: roleJobUserTable.userId,
          id: roleJobTable.id,
          tag: roleJobTable.name,
        })
        .from(roleJobUserTable)
        .innerJoin(
          roleJobTable,
          eq(roleJobUserTable.roleJobId, roleJobTable.id)
        )
        .where(eq(roleJobUserTable.userId, id));

      const roleRows = await tx
        .select({
          userId: userRoleTable.userId,
          id: roleTable.id,
          tag: roleTable.name,
        })
        .from(userRoleTable)
        .innerJoin(roleTable, eq(userRoleTable.roleId, roleTable.id))
        .where(eq(userRoleTable.userId, id));

      const result: UserDTO = {
        id: userRow.id,
        userName: userRow.userName,
        firstName: userRow.firstName,
        lastName: userRow.lastName,
        email: userRow.email,
        phone: userRow.phone,
        active: userRow.active,
        avatar: userRow.avatar,
        roleJob: roleJobRows.map((r) => ({ id: r.id, tag: r.tag })),
        permissionRole: roleRows.map((p) => ({ id: p.id, tag: p.tag })),
      };

      return { state: "success", success: "User found", data: result };
    });
  });

export const listUsers = async (
  page = 1,
  pageSize = 20
): Promise<ActionResultGeneric<{ data: UserDTO[]; total: number }>> =>
  wrap(async () => {
    const requiredPermission = "user:list";
    const { user: authUser } = await authorize();
    if (!authUser) return { state: "error", error: "Authentication required" };
    if (!(await hasPermission(authUser.id, requiredPermission)))
      return { state: "error", error: "Insufficient permissions" };

    return await db.transaction(async (tx) => {
      const allUsers = await tx.query.userTable.findMany();
      const total = allUsers.length;

      const paginatedUsers = allUsers.slice(
        (page - 1) * pageSize,
        page * pageSize
      );
      const userIds = paginatedUsers.map((u) => u.id);
      if (!userIds.length)
        return {
          state: "success",
          success: "No users found",
          data: { data: [], total },
        };

      const roleJobRows = await tx
        .select({
          userId: roleJobUserTable.userId,
          id: roleJobTable.id,
          tag: roleJobTable.name,
        })
        .from(roleJobUserTable)
        .innerJoin(
          roleJobTable,
          eq(roleJobUserTable.roleJobId, roleJobTable.id)
        )
        .where(inArray(roleJobUserTable.userId, userIds));

      const roleRows = await tx
        .select({
          userId: userRoleTable.userId,
          id: roleTable.id,
          tag: roleTable.name,
        })
        .from(userRoleTable)
        .innerJoin(roleTable, eq(userRoleTable.roleId, roleTable.id))
        .where(inArray(userRoleTable.userId, userIds));

      const roleJobMap = new Map<string, { id: string; tag: string }[]>();
      const roleMap = new Map<string, { id: string; tag: string }[]>();

      for (const uid of userIds) {
        roleJobMap.set(uid, []);
        roleMap.set(uid, []);
      }

      for (const row of roleJobRows) {
        roleJobMap.get(row.userId)!.push({ id: row.id, tag: row.tag });
      }
      for (const row of roleRows) {
        roleMap.get(row.userId)!.push({ id: row.id, tag: row.tag });
      }

      const result: UserDTO[] = paginatedUsers.map((u) => ({
        id: u.id,
        userName: u.userName,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        active: u.active,
        avatar: u.avatar,
        hashedPin: u.hashedPin,
        roleJob: roleJobMap.get(u.id)!,
        permissionRole: roleMap.get(u.id)!,
      }));

      return {
        state: "success",
        success: "Users retrieved",
        data: {
          data: result,
          total,
        },
      };
    });
  });

export const updateUser = async (
  input: UpdateUserInput
): Promise<ActionResultGeneric<UserDTO>> =>
  wrap(async () => {
    const requiredPermission = "user:update";
    const { user: authUser } = await authorize();
    if (!authUser) return { state: "error", error: "Authentication required" };
    if (!(await hasPermission(authUser.id, requiredPermission)))
      return { state: "error", error: "Insufficient permissions" };

    const {
      id,
      userName,
      firstName,
      lastName,
      email,
      phone,
      roleJob,
      permissionRole,
    } = validate(updateUserSchema, input) as UpdateUserInput;

    const exists = await db.query.userTable.findFirst({
      where: (t) => eq(t.id, id),
    });
    if (!exists)
      return { state: "error", error: "User with given id does not exist" };

    await db.transaction(async (tx) => {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (userName !== undefined) updateData.userName = userName;
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;

      if (Object.keys(updateData).length > 1) {
        await tx.update(userTable).set(updateData).where(eq(userTable.id, id));
      }

      if (roleJob !== undefined) {
        await tx.delete(roleJobUserTable).where(eq(roleJobUserTable.userId, id));
        if (roleJob.length > 0) {
          await tx.insert(roleJobUserTable).values(
            roleJob.map((opt: { value: string }) => ({
              userId: id,
              roleJobId: opt.value,
            }))
          );
        }
      }

      if (permissionRole !== undefined) {
        await tx.delete(userRoleTable).where(eq(userRoleTable.userId, id));
        if (permissionRole.length > 0) {
          await tx.insert(userRoleTable).values(
            permissionRole.map((opt: { value: string }) => ({
              userId: id,
              roleId: opt.value,
            }))
          );
        }
      }
    });

    const updatedUserResult = await getUserById(id);
    if (updatedUserResult.state !== "success" || !updatedUserResult.data)
      return {
        state: "error",
        error: "Failed to fetch updated user data",
      };

    return {
      state: "success",
      success: "User updated successfully",
      data: updatedUserResult.data,
    };
  });

export const deleteUser = async (
  id: string
): Promise<ActionResultGeneric<null>> =>
  wrap(async () => {
    const requiredPermission = "user:delete";
    const { user: authUser } = await authorize();
    if (!authUser) return { state: "error", error: "Authentication required" };
    if (!(await hasPermission(authUser.id, requiredPermission)))
      return { state: "error", error: "Insufficient permissions" };

    const exists = await db.query.userTable.findFirst({
      where: (t) => eq(t.id, id),
    });
    if (!exists) return { state: "error", error: "User not found" };

    await db.delete(userTable).where(eq(userTable.id, id)).execute();

    return {
      state: "success",
      success: "User deleted successfully",
      data: null,
    };
  });