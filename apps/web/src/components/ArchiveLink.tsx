import Link from "next/link";

type Props = {
  className?: string;
};

export function ArchiveLink({ className = "" }: Props) {
  return (
    <Link
      href="/archive"
      className={`group inline-flex items-center gap-2 font-serif font-semibold text-[1.2rem] leading-tight text-accent no-underline transition-colors hover:text-[var(--accent-hover)] ${className}`}
    >
      <span
        aria-hidden
        className="inline-block transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
      <span className="title-underline">All Essays</span>
    </Link>
  );
}
