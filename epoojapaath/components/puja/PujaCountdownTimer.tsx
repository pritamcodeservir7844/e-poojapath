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

export function PujaCountdownTimer({ scheduledAt }: { scheduledAt?: string }) {
  const target = scheduledAt ? new Date(scheduledAt) : getDefaultTarget();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduledAt]);

  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

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
        <span className="bg-saffron text-white rounded-md px-2 py-0.5 min-w-[2rem] text-center tabular-nums">{pad(timeLeft.hours)}</span>
        <span className="text-saffron font-black">:</span>
        <span className="bg-saffron text-white rounded-md px-2 py-0.5 min-w-[2rem] text-center tabular-nums">{pad(timeLeft.minutes)}</span>
        <span className="text-saffron font-black">:</span>
        <span className="bg-saffron text-white rounded-md px-2 py-0.5 min-w-[2rem] text-center tabular-nums">{pad(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}
