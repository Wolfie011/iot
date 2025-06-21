// app/api/user/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "@/app/actions/user.action";

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const result = await getUserById(params.id);
  return NextResponse.json(result, { status: result.state === "error" ? 404 : 200 });
}

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: User updated
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const result = await updateUser({ ...body, id: params.id });
  return NextResponse.json(result, { status: result.state === "error" ? 400 : 200 });
}

/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 */
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const result = await deleteUser(params.id);
  return NextResponse.json(result, { status: result.state === "error" ? 400 : 204 });
}