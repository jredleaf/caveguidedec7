"use client";

export interface Shift {
  role: string;
  first_name: string;
  last_name: string;
  start_at: string;
}

export interface ShiftResponse {
  shifts?: Shift[];
  error?: string;
}

export interface CachedShiftData {
  data: Shift | null;
  timestamp: number;
}

export class ShiftError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShiftError';
  }
}