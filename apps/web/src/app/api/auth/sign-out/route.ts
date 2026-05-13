import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/auth/sign-in';

  (await cookies()).delete('token-saas-next')

  return NextResponse.redirect(redirectUrl);
}