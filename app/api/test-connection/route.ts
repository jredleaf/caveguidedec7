import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const BASE_URL = 'https://api.joinhomebase.com/api/public';

export async function GET() {
  try {
    const headersList = headers();
    const host = headersList.get('host') || '';
    console.log('Incoming request from host:', host);
    
    if (!host.includes('localhost') && !host.includes('.stackblitz.io')) {
      console.error('Unauthorized host:', host);
      return NextResponse.json({ 
        error: 'Unauthorized request'
      }, { status: 401 });
    }

    const API_TOKEN = process.env.HOMEBASE_API_TOKEN;

    if (!API_TOKEN) {
      console.error('API token is missing from environment');
      return NextResponse.json({ 
        error: 'Missing API token'
      }, { status: 500 });
    }

    console.log('Testing connection to Homebase API...');
    
    // Test the connection by fetching locations
    const response = await fetch(`${BASE_URL}/locations`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/vnd.homebase-v1+json',
      },
      cache: 'no-store'
    });

    const responseText = await response.text();
    const responseDetails = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText
    };
    
    console.log('API Test Response:', responseDetails);

    if (!response.ok) {
      console.error('API connection failed:', responseDetails);
      return NextResponse.json({ 
        error: 'API connection failed',
        status: response.status,
        statusText: response.statusText,
        details: responseText
      }, { status: response.status });
    }

    console.log('API connection successful');
    return NextResponse.json({ 
      success: true,
      message: 'API connection successful'
    });
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json({ 
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}