"use client";

import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  isListening: boolean;
  audioLevel?: number; // 0 - 100
  className?: string;
}

export function AudioWaveform({ isListening, audioLevel = 0, className }: AudioWaveformProps) {
  if (!isListening) return null;

  const barCount = 7;
  const bars = Array.from({ length: barCount });

  return (
    <div className={cn("flex items-center justify-center gap-1 h-8", className)}>
      {bars.map((_, i) => {
        // Vary height dynamically based on audio level
        const multiplier = Math.sin((i / barCount) * Math.PI) * 1.5;
        const dynamicHeight = Math.max(4, Math.min(28, (audioLevel / 3) * multiplier + (Math.random() * 4)));

        return (
          <span
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-amber-500 to-rose-500 transition-all duration-75"
            style={{
              height: `${dynamicHeight}px`,
              opacity: audioLevel > 5 ? 0.9 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
}
