// app/api/auth/signup/route.ts

import { signUp } from "@/app/actions/auth.action";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpInput'
 *     responses:
 *       201:
 *         description: Account created
 *       400:
 *         description: Validation or conflict error
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await signUp(body);
  return NextResponse.json(result, { status: result.error ? 400 : 201 });
}