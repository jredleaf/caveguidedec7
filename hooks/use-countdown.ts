"use client";

import { useState, useEffect, useCallback } from 'react';
import { getMinutesUntilTime } from '@/lib/time-utils';

interface UseCountdownProps {
  targetMinutes: number;
  onComplete?: () => void;
}

export function useCountdown({ targetMinutes, onComplete }: UseCountdownProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const startTimer = useCallback(() => {
    if (targetMinutes === null) return;
    const minutes = getMinutesUntilTime(targetMinutes);
    setTimeLeft(minutes * 60);
    setIsActive(true);
  }, [targetMinutes]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(null);
  }, []);

  const toggleTimer = useCallback(() => {
    if (isActive) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [isActive, startTimer, stopTimer]);

  useEffect(() => {
    if (!isActive || timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((current) => {
        if (current === null) return null;
        if (current <= 1) {
          setIsActive(false);
          onComplete?.();
          return null;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  return {
    isActive,
    timeLeft,
    toggleTimer,
    stopTimer
  };
}