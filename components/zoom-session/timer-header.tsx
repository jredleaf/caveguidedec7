"use client";

import { useState, useEffect } from "react";
import { TimerDisplay } from "./timer-display";
import { CustomTimer } from "./custom-timer";
import { getTimeUntilMinute, formatTime } from "@/lib/time-utils";
import { useSound } from "@/lib/use-sound";

export function TimerHeader() {
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { play: playChime } = useSound('/sounds/chime.mp3');

  useEffect(() => {
    if (!activeTimer) return;

    const updateTimer = () => {
      const { minutes, seconds } = getTimeUntilMinute(activeTimer);
      setTimeLeft(formatTime(minutes, seconds));

      // Check if timer completed
      if (minutes === 0 && seconds === 0) {
        playChime();
        setActiveTimer(null);
        setTimeLeft("");
      }
    };

    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, playChime]);

  const handleTimerClick = (minute: number) => {
    if (activeTimer === minute) {
      setActiveTimer(null);
      setTimeLeft("");
    } else {
      setActiveTimer(minute);
    }
  };

  return (
    <header className="p-3 flex items-center justify-between border-b">
      <div className="flex gap-2">
        <TimerDisplay
          targetMinute={54}
          isActive={activeTimer === 54}
          onClick={() => handleTimerClick(54)}
          displayTime={activeTimer === 54 ? timeLeft : ""}
        />
        <TimerDisplay
          targetMinute={24}
          isActive={activeTimer === 24}
          onClick={() => handleTimerClick(24)}
          displayTime={activeTimer === 24 ? timeLeft : ""}
        />
      </div>
      <CustomTimer
        onSelectTime={(minute) => handleTimerClick(minute)}
        isActive={activeTimer !== null && activeTimer !== 54 && activeTimer !== 24}
      />
    </header>
  );
}