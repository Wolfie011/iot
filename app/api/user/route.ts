import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  listUsers,
} from "@/app/actions/user.action";

/**
 * @openapi
 * /api/user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get paginated list of users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: List of users
 */
export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page") || 1);
  const pageSize = Number(req.nextUrl.searchParams.get("pageSize") || 20);
  const result = await listUsers(page, pageSize);
  return NextResponse.json(result, { status: result.state === "error" ? 400 : 200 });
}

/**
 * @openapi
 * /api/user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpInput'
 *     responses:
 *       201:
 *         description: User created
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await createUser(body);
  return NextResponse.json(result, { status: result.state === "error" ? 400 : 201 });
}