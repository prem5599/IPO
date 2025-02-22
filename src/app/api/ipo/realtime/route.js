import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request) {
  // Webhook endpoint for real-time updates
  try {
    // Validate incoming webhook (add security checks)
    const payload = await request.json();
    
    // Revalidate IPO data cache
    revalidateTag('ipo-data');
    
    return NextResponse.json({ 
      message: 'IPO data refreshed',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Update failed' }, 
      { status: 500 }
    );
  }
}