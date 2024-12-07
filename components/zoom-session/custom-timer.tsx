"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTimeToMinutes } from "@/lib/time-utils";

interface CustomTimerProps {
  onSelectTime: (minutes: number) => void;
  isActive?: boolean;
}

export function CustomTimer({ onSelectTime, isActive }: CustomTimerProps) {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const handleSelect = (minutes: number) => {
    setSelectedTime(minutes);
    onSelectTime(minutes);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={isActive ? "default" : "outline"} 
          size="sm" 
          className="ml-2"
        >
          {selectedTime !== null ? formatTimeToMinutes(selectedTime) : 'Custom'} <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="h-[200px] overflow-y-auto">
        {Array.from({ length: 60 }, (_, i) => (
          <DropdownMenuItem key={i} onSelect={() => handleSelect(i)}>
            {formatTimeToMinutes(i)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}