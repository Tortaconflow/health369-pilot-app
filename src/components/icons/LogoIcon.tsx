import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

const LogoIcon = ({ className, ...props }: LucideProps) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <defs>
        <linearGradient id="valkyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="valkyWings" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Hexagonal Shield Base */}
      <polygon
        points="32,4 58,16 58,44 32,60 6,44 6,16"
        fill="#0B1120"
        stroke="url(#valkyGold)"
        strokeWidth="2.5"
        className="filter drop-shadow-md"
      />

      {/* Valkyrie Wings / V Symbol */}
      <path
        d="M14 20 L32 50 L50 20 L40 20 L32 36 L24 20 Z"
        fill="url(#valkyWings)"
      />

      {/* Central Hero Core Star / Valky Beacon */}
      <polygon
        points="32,14 35,22 43,24 37,30 39,38 32,33 25,38 27,30 21,24 29,22"
        fill="#FFFFFF"
        opacity="0.95"
      />
    </svg>
  );
};

export default LogoIcon;
