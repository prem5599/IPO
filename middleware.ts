// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()
  
  // Add performance headers
  response.headers.set('X-Response-Time', Date.now().toString())
  response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200')
  
  return response
}