interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export default function Logo({ className = '', showTagline = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="h-8 w-8 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M44 18c4 2 6 6 5 11s-5 8-10 8c-1 0-3-1-3-1s4 9 4 14h-4c0-6-7-13-12-17-4-4-6-9-3-13s10-3 13 1c0 0 1-3 4-4s4 0 6 1Z"
          fill="#8FB59B"
        />
        <path
          d="M22 42c0-3 2-5 5-5s5 2 5 5"
          stroke="#557F65"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="leading-none">
        <div className="font-display text-xl font-bold tracking-tight text-sage-600">
          A Maï
        </div>
        {showTagline && (
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage-500">
            Salades & Poke Bowls
          </div>
        )}
      </div>
    </div>
  );
}
