"use client";

import { Timer } from "lucide-react";

interface TimerDisplayProps {
  targetMinute: number;
  isActive?: boolean;
  onClick?: () => void;
  displayTime: string;
}

export function TimerDisplay({ targetMinute, isActive = false, onClick, displayTime }: TimerDisplayProps) {
  return (
    <div 
      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive ? 'bg-secondary border border-border' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <Timer className="w-5 h-5" />
      <span className="font-semibold text-foreground">
        {isActive ? displayTime : `to :${targetMinute.toString().padStart(2, '0')}`}
      </span>
    </div>
  );
}