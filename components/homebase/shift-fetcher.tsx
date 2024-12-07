"use client";

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { ShiftDisplay } from './shift-display';
import { getCachedShiftData, cacheShiftData } from '@/lib/homebase/utils';
import { fetchNextShift, testApiConnection } from '@/lib/homebase/api';
import { ShiftError } from '@/lib/homebase/types';

export function ShiftFetcher() {
  const [connectionTested, setConnectionTested] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const cached = getCachedShiftData();
    return cached?.timestamp || null;
  });

  useEffect(() => {
    const testConnection = async () => {
      if (!process.env.NEXT_PUBLIC_HOMEBASE_API_TOKEN) {
        setConnectionError('API configuration missing');
        return;
      }

      try {
        await testApiConnection();
        setConnectionTested(true);
        setConnectionError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Connection failed';
        console.error('Connection test failed:', error);
        setConnectionError(errorMessage);
      }
    };

    if (!connectionTested && typeof window !== 'undefined') {
      testConnection();
    }
  }, [connectionTested]);
  
  const { data: shift, error, isLoading } = useSWR(
    connectionTested ? 'next-shift' : null,
    async () => {
      try {
        const cachedData = getCachedShiftData();
        if (cachedData) {
          console.log('Using cached shift data:', cachedData);
          setLastUpdated(cachedData.timestamp);
          return cachedData.data;
        }

        console.log('Fetching fresh shift data...');
        const newShift = await fetchNextShift();
        console.log('New shift data received:', newShift);
        cacheShiftData(newShift);
        setLastUpdated(Date.now());
        return newShift;
      } catch (error) {
        console.error('Error in shift fetcher:', error);
        if (error instanceof ShiftError) {
          throw error;
        }
        throw new ShiftError('Unable to load schedule');
      }
    },
    {
      refreshInterval: 24 * 60 * 60 * 1000, // Refresh once per day
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      fallbackData: getCachedShiftData()?.data || null
    }
  );

  if (connectionError) {
    console.log('Displaying connection error:', connectionError);
    return (
      <ShiftDisplay
        shift={null}
        isLoading={false}
        error={new Error(connectionError)}
        lastUpdated={null}
      />
    );
  }

  return (
    <ShiftDisplay
      shift={shift}
      isLoading={!connectionTested || isLoading}
      error={error instanceof Error ? error : null}
      lastUpdated={lastUpdated}
    />
  );
}