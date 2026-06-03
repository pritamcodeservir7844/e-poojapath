"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  const totalSec = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSec / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getDefaultTarget(): Date {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  t.setHours(6, 0, 0, 0);
  return t;
}

function getNextTargetDate(availableDates?: string[], scheduledAt?: string): Date {
  const pad = (n: number) => String(n).padStart(2, "0");

  if (!availableDates || availableDates.length === 0) {
    return scheduledAt ? new Date(scheduledAt) : getDefaultTarget();
  }

  // Get UTC time components from scheduledAt if available
  let hours = 6;
  let minutes = 0;
  let seconds = 0;
  if (scheduledAt) {
    const schedDate = new Date(scheduledAt);
    if (!isNaN(schedDate.getTime())) {
      hours = schedDate.getUTCHours();
      minutes = schedDate.getUTCMinutes();
      seconds = schedDate.getUTCSeconds();
    }
  }

  const now = new Date();

  // Find the first available date in the future or today
  for (const dateStr of availableDates) {
    const targetStr = `${dateStr}T${pad(hours)}:${pad(minutes)}:${pad(seconds)}.000Z`;
    const dateObj = new Date(targetStr);
    
    if (dateObj.getTime() > now.getTime()) {
      return dateObj;
    }
  }

  // Fallback to the last available date if all are in the past
  const lastDateStr = availableDates[availableDates.length - 1];
  const targetStr = `${lastDateStr}T${pad(hours)}:${pad(minutes)}:${pad(seconds)}.000Z`;
  return new Date(targetStr);
}

export function PujaCountdownTimer({
  scheduledAt,
  availableDates,
}: {
  scheduledAt?: string;
  availableDates?: string[];
}) {
  // Start as null to avoid SSR/client mismatch (hydration error)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = getNextTargetDate(availableDates, scheduledAt);
    // Set immediately on mount (client only)
    setTimeLeft(getTimeLeft(target));

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [scheduledAt, availableDates]);

  // Don't render anything until client has mounted
  if (timeLeft === null) return null;

  const isExpired =
    timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-saffron text-white text-xs font-semibold px-3 py-1.5 rounded-full animate-pulse">
        🪔 Puja in progress
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-saffron/10 border border-saffron/30 rounded-full px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron" />
      </span>
      <span className="text-xs font-medium text-muted-foreground">Puja starts in</span>
      <div className="flex items-center gap-1 font-mono font-bold text-sm">
        <span className="bg-saffron text-white rounded-md px-2 py-0.5 min-w-[2rem] text-center tabular-nums">
          {pad(timeLeft.hours)}
        </span>
        <span className="text-saffron font-black">:</span>
        <span className="bg-saffron text-white rounded-md px-2 py-0.5 min-w-[2rem] text-center tabular-nums">
          {pad(timeLeft.minutes)}
        </span>
        <span className="text-saffron font-black">:</span>
        <span className="bg-saffron text-white rounded-md px-2 py-0.5 min-w-[2rem] text-center tabular-nums">
          {pad(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
}
