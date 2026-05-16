import { NextResponse, type NextRequest } from "next/server";
import { env } from "@saas_node_next_react/env";

export function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl;

  const response = NextResponse.next();

  if(pathname.startsWith('/organization')) {
    const [,, slug] = pathname.split('/');

    response.cookies.set(env.NEXT_PUBLIC_COOKIE_ORGANIZATION, slug);

  } else { 
    response.cookies.delete(env.NEXT_PUBLIC_COOKIE_ORGANIZATION);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}