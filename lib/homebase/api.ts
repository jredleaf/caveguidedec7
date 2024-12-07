"use client";

import { Shift, ShiftError } from './types';

const BASE_URL = 'https://api.joinhomebase.com/api/public';
const LOCATION_UUID = process.env.NEXT_PUBLIC_HOMEBASE_LOCATION_UUID;
const API_TOKEN = process.env.NEXT_PUBLIC_HOMEBASE_API_TOKEN;

const headers = new Headers({
  'Authorization': `Bearer ${API_TOKEN}`,
  'Accept': 'application/vnd.homebase-v1+json'
});

export async function testApiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    if (!API_TOKEN) {
      throw new Error('API token not configured');
    }

    const response = await fetch(`${BASE_URL}/locations`, {
      method: 'GET',
      headers,
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API test error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API test failed with status ${response.status}`);
    }

    return { success: true, message: 'API connection successful' };
  } catch (error) {
    console.error('API connection test failed:', error);
    throw new Error('Unable to connect to API');
  }
}

export async function fetchNextShift(): Promise<Shift | null> {
  try {
    if (!API_TOKEN || !LOCATION_UUID) {
      throw new Error('API configuration missing');
    }

    const now = new Date();
    const startDate = now.toISOString().split('.')[0] + 'Z';
    const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z';
    
    const url = new URL(`${BASE_URL}/locations/${LOCATION_UUID}/shifts`);
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);
    url.searchParams.append('per_page', '1');
    url.searchParams.append('page', '1');
    url.searchParams.append('date_filter', 'start_at');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: url.toString()
      });
      
      if (response.status === 429) {
        throw new ShiftError('Rate limit exceeded. Please try again later.');
      }
      throw new ShiftError('Unable to fetch schedule data');
    }

    const data = await response.json();
    console.log('Shift data received:', data);
    
    if (!data.shifts?.length) {
      return null;
    }

    return data.shifts[0];
  } catch (error) {
    if (error instanceof ShiftError) {
      throw error;
    }
    console.error('Error fetching shifts:', error);
    throw new ShiftError('Unable to load schedule');
  }
}