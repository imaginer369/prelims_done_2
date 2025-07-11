import React, { useEffect, useRef } from "react";

interface QuizTimerProps {
  totalSeconds: number;
  secondsLeft: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

export default function QuizTimer({ totalSeconds, secondsLeft, onTimeUp, isRunning }: QuizTimerProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        if (secondsLeft - 1 <= 0) {
          onTimeUp();
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, secondsLeft, onTimeUp]);

  // Color logic
  const percent = secondsLeft / totalSeconds;
  let color = "text-blue-700 dark:text-blue-200";
  let blink = false;
  if (percent <= 0.1) {
    color = "text-red-600 dark:text-red-400 animate-pulse";
    blink = true;
  } else if (percent <= 0.3) {
    color = "text-yellow-500 dark:text-yellow-300";
  }

  // Format mm:ss
  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className={`fixed top-6 right-8 z-50 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-xl shadow-lg border border-blue-200 dark:border-slate-700 font-mono text-xl font-bold ${color} ${blink ? "animate-blink" : ""}`}
      style={{ transition: "color 0.3s" }}
      aria-label="Quiz timer"
    >
      <span role="img" aria-label="timer">⏰</span>
      <span>{mm}:{ss}</span>
    </div>
  );
}
