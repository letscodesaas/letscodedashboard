import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const revalidate = 0;
export async function middleware(request: NextRequest) {
  try {
    const xff = request.headers.get('x-forwarded-for');
    const ip =
      (xff && xff.split(',')[0].trim()) ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userIPAllow = process.env.ALLOWIPS;
    const IPS = [];
    if (!Array.isArray(userIPAllow)) {
      userIPAllow.split(',').map((ele) => {
        IPS.push(ele);
      });
    }
    if (!IPS.includes(ip)) {
      console.log('not allowed' + ip);
      return NextResponse.json({ error: 'Not Allowed' }, { status: 403 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: '/dashboard/:path*',
};
