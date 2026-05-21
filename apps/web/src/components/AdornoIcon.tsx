type Props = {
  size?: number;
  className?: string;
};

export function AdornoIcon({ size = 56, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M 40 10 C 52 10 56 18 54 26 L 52 50 C 51 56 49 60 46 60 L 38 60 L 36 48 C 33 47 31 47 28 46 L 26 44 C 24 42 22 40 20 40 C 16 39 13 37 12 35 C 14 33 18 32 22 30 L 23 18 C 26 12 33 10 40 10 Z" />
      <path d="M 26 18 C 32 14 42 16 50 16" />
      <circle cx="22" cy="33" r="6.5" />
      <path d="M 28 32 C 35 30 44 28 50 26" />
    </svg>
  );
}
