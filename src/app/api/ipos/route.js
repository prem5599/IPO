// app/api/ipos/route.js
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/ipos`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { 
        revalidate: 300,
        tags: ['ipo-data']
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();

    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data structure received from API');
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' }, 
      { status: 500 }
    );
  }
}

// app/api/ipos/[symbol]/route.js
export async function GET(request, { params }) {
  const { symbol } = params;

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/ipos/${symbol}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { 
        revalidate: 300,
        tags: ['ipo-details']
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error(`Error fetching IPO details for ${symbol}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch IPO details' },
      { status: 500 }
    );
  }
}

// app/api/revalidate/route.js
import { revalidateTag } from 'next/cache';

export async function POST(request) {
  try {
    const { tag = 'ipo-data' } = await request.json();
    
    // Revalidate the tag
    revalidateTag(tag);
    
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      tag
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({
      revalidated: false,
      now: Date.now(),
      error: 'Failed to revalidate'
    }, { status: 500 });
  }
}