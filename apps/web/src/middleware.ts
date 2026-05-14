import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log('>>ROUTE middleware')
  const { pathname } = req.nextUrl;

  const response = NextResponse.next();

  if(pathname.startsWith('/organization')) {
    const [,, slug] = pathname.split('/');

    response.cookies.set('organization', slug);

  } else { 
    response.cookies.delete('organization');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}