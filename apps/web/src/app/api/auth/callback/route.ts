import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import  STATUS_CODE from "../../../../../../../types/status"
import { singInWithGithub } from "@/http/sign-in-github";
import { acceptInvite } from "@/http/accept-invite";
import { env } from "@saas_node_next_react/env";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get('code');

  if(!code) {
    return NextResponse.json(
      {message: 'Github OAuth code was not found.'},
      {status: STATUS_CODE.BAD_REQUEST}
    )
  }

  const { token } = await singInWithGithub({ code });

  (await cookies()).set(env.NEXT_PUBLIC_COOKIE_TOKEN, token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const inviteId = (await cookies()).get('inviteId')?.value;

  if(inviteId) {
    try {
      await acceptInvite({ inviteId });
      (await cookies()).delete('inviteId')
    } catch (error) {
      console.error(error)
    }
  }

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/';
  redirectUrl.search = '';

  return NextResponse.redirect(redirectUrl);
}