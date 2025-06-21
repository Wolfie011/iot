// app/api/auth/signin/route.ts

import { signIn } from "@/app/actions/auth.action";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/auth/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Sign in user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInInput'
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await signIn(body);
  return NextResponse.json(result, { status: result.error ? 400 : 200 });
}