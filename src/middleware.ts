import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';



export async function middleware(request: NextRequest) {
  try {
    const headers = await request.headers.get('AUTHORIZATION');
    if(!headers){
        return NextResponse.redirect(new URL('/', request.url));
    }

  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: '/about/:path*',
};
