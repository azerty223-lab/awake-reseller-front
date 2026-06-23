"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className={cn("flex gap-4", className)}>
        {["Days", "Hours", "Mins", "Secs"].map((label) => (
          <TimeUnit key={label} value={0} label={label} />
        ))}
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  return (
    <div className={cn("flex gap-3 sm:gap-4", className)}>
      {units.map(({ value, label }, index) => (
        <div key={label} className="flex items-center gap-3 sm:gap-4">
          <TimeUnit value={value} label={label} />
          {index < units.length - 1 && (
            <span className="text-[#c9a84c] text-2xl sm:text-3xl font-bold -mt-4 opacity-60">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass-dark rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border border-[#c9a84c]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/5 to-transparent" />
        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums relative z-10">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-2 font-medium">
        {label}
      </span>
    </div>
  );
}
