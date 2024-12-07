export function getTimeUntilMinute(targetMinute: number): { minutes: number; seconds: number } {
  const now = new Date();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  
  let minutesUntilTarget = targetMinute - currentMinute;
  
  // If we've passed the target minute this hour, calculate for next hour
  if (minutesUntilTarget <= 0) {
    minutesUntilTarget = 60 + minutesUntilTarget;
  }
  
  // Adjust for current seconds
  const totalSeconds = (minutesUntilTarget * 60) - currentSecond;
  
  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60
  };
}

export function formatTime(minutes: number, seconds: number): string {
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatTimeToMinutes(minutes: number): string {
  return `:${minutes.toString().padStart(2, '0')}`;
}