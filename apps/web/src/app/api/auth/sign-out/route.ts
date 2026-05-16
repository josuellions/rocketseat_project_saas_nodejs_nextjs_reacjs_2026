import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { env } from "@saas_node_next_react/env";

export async function GET(request: NextRequest) {

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/auth/sign-in';

  (await cookies()).delete(env.NEXT_PUBLIC_COOKIE_TOKEN)

  return NextResponse.redirect(redirectUrl);
}