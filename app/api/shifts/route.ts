import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ShiftResponse } from '@/lib/homebase/types';

const LOCATION_UUID = '73b6c823-f26c-43b7-94be-e5134d81d19c';
const BASE_URL = 'https://api.joinhomebase.com/api/public';

export async function GET() {
  try {
    const headersList = headers();
    const host = headersList.get('host') || '';
    
    if (!host.includes('localhost') && !host.includes('.stackblitz.io')) {
      return NextResponse.json({ 
        error: 'Unauthorized request'
      } as ShiftResponse, { status: 401 });
    }

    const API_TOKEN = process.env.HOMEBASE_API_TOKEN;

    if (!API_TOKEN) {
      console.error('API token is missing');
      return NextResponse.json({ 
        error: 'Server configuration error'
      } as ShiftResponse, { status: 500 });
    }

    // Get current time in EST and format dates
    const now = new Date();
    const startDate = now.toISOString().split('.')[0] + 'Z'; // Remove milliseconds
    const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z';
    
    const url = new URL(`${BASE_URL}/locations/${LOCATION_UUID}/shifts`);
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);
    url.searchParams.append('per_page', '1');
    url.searchParams.append('page', '1');
    url.searchParams.append('date_filter', 'start_at');
    
    console.log('Fetching shifts from:', url.toString());
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/vnd.homebase-v1+json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Homebase API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: url.toString()
      });
      
      if (response.status === 429) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded. Please try again later.'
        } as ShiftResponse, { status: 429 });
      }
      
      return NextResponse.json({ 
        error: 'Unable to fetch schedule data'
      } as ShiftResponse, { status: response.status });
    }

    const data = await response.json();
    
    // Log successful response for debugging
    console.log('API Response:', {
      total: response.headers.get('Total'),
      perPage: response.headers.get('Per-Page'),
      shiftsCount: data.shifts?.length,
      firstShift: data.shifts?.[0]
    });

    return NextResponse.json({ shifts: data.shifts } as ShiftResponse);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      error: 'Unable to load schedule'
    } as ShiftResponse, { status: 500 });
  }
}