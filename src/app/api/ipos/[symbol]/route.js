import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { symbol } = params;
  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  console.log('API Base URL:', apiBaseUrl);
  console.log('API Key:', apiKey ? 'API Key is set' : 'API Key is missing');

  if (!apiBaseUrl || !apiKey) {
    console.error('Missing API base URL or API key. Please check your environment variables.');
    return NextResponse.json(
      { error: 'Missing API base URL or API key' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${apiBaseUrl}/ipos/${symbol}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching IPO details for ${symbol}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch IPO details' },
      { status: 500 }
    );
  }
}