import { accountActivation } from "@/app/actions/auth.action";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/auth/activate:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Activate user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivationInput'
 *     responses:
 *       200:
 *         description: Account activated
 *       400:
 *         description: Validation or unauthorized
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await accountActivation(body);
  return NextResponse.json(result, { status: result.error ? 400 : 200 });
}