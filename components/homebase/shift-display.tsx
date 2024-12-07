"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { formatShiftTime, getTimeAgoString } from "@/lib/homebase/utils";
import { Shift } from "@/lib/homebase/types";

interface ShiftDisplayProps {
  shift: Shift | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: number | null;
}

export function ShiftDisplay({ shift, isLoading, error, lastUpdated }: ShiftDisplayProps) {
  if (isLoading) {
    return (
      <Card className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-destructive">
        Unable to load schedule
      </Card>
    );
  }

  if (!shift) {
    return (
      <Card className="p-4">
        No upcoming shifts found
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            {shift.first_name} {shift.last_name}
          </p>
          <p className="text-sm text-muted-foreground">{shift.role}</p>
          <p className="text-sm font-medium mt-1">
            {formatShiftTime(shift.start_at)}
          </p>
        </div>
      </div>
      {lastUpdated && (
        <p className="text-xs text-muted-foreground">
          Updated {getTimeAgoString(lastUpdated)}
        </p>
      )}
    </Card>
  );
}