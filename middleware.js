// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Add performance headers
  response.headers.set('X-Response-Time', Date.now().toString());
  
  // Update cache control header to prevent caching issues
  if (request.nextUrl.pathname.startsWith('/ipo/')) {
    response.headers.set('Cache-Control', 'no-store');
  } else {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200');
  }
  
  return response;
}

// Add config to specify which routes to run middleware on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};