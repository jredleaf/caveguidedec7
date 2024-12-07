"use client";

import { formatInTimeZone } from 'date-fns-tz';
import { CachedShiftData, Shift } from './types';

const CACHE_KEY = 'homebase_shift_data';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function formatShiftTime(isoTime: string): string {
  return formatInTimeZone(new Date(isoTime), 'America/New_York', 'h:mm a zzz');
}

export function getCachedShiftData(): CachedShiftData | null {
  if (typeof window === 'undefined') return null;
  
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const parsedCache = JSON.parse(cached) as CachedShiftData;
  const now = Date.now();

  if (now - parsedCache.timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return parsedCache;
}

export function cacheShiftData(shift: Shift | null): void {
  if (typeof window === 'undefined') return;

  const cacheData: CachedShiftData = {
    data: shift,
    timestamp: Date.now(),
  };

  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

export function getTimeAgoString(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
}