// app/api/auth/signout/route.ts

import { signOut } from "@/app/actions/auth.action";
import { NextResponse } from "next/server";

/**
 * @openapi
 * /api/auth/signout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Sign out current user
 *     responses:
 *       200:
 *         description: Signed out
 *       400:
 *         description: No active session
 */
export async function POST() {
  const result = await signOut();
  return NextResponse.json(result, { status: result.error ? 400 : 200 });
}