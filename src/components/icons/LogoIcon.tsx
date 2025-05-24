// src/components/icons/LogoIcon.tsx
import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

const LogoIcon = ({ className, ...props }: LucideProps) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)} // Default size, can be overridden by className prop
      {...props}
    >
      {/* Outer circle with a gradient from accent to primary */}
      <defs>
        <linearGradient id="health369LogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent))" /> {/* Light Green */}
          <stop offset="100%" stopColor="hsl(var(--primary))" /> {/* Light Blue */}
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#health369LogoGradient)" />

      {/* Inner circle providing a colored background for the figure */}
      <circle cx="32" cy="32" r="26" fill="hsl(var(--primary))" /> {/* Light Blue Background */}

      {/* Stylized figure using primary-foreground (white) for good contrast */}
      {/* Head */}
      <circle cx="32" cy="20" r="5" fill="hsl(var(--primary-foreground))" />
      {/* Torso and main leg */}
      <path
        d="M32 25 C32 30 30 38 23 46"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Trailing leg */}
      <path
        d="M33 36 C36 38 41 42 41 42"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arms for dynamic feel */}
      <path
        d="M32 28 C40 26 46 30 46 30" // Arm reaching forward
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
       <path
        d="M31 29 C25 32 20 28 20 28" // Arm trailing back
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default LogoIcon;
