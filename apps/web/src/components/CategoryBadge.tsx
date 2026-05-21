import type { PostCategory } from "@lib/categories";
import type { ReactElement } from "react";

const ICONS: Record<PostCategory, ReactElement> = {
  ai: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="2" />
      <path d="M6 1v1M6 10v1M1 6h1M10 6h1" />
      <path d="M2.5 2.5l.7.7M8.8 8.8l.7.7M2.5 9.5l.7-.7M8.8 3.2l.7-.7" />
    </svg>
  ),
  tech: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 3L1 6l3 3M8 3l3 3-3 3" />
    </svg>
  ),
  philosophy: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M2.5 6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2" />
      <path d="M9.5 6c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2" />
    </svg>
  ),
  sociology: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="4.5" cy="3.5" r="1.5" />
      <path d="M1 10c0-1.9 1.6-3.5 3.5-3.5" />
      <circle cx="8.5" cy="3.5" r="1.5" />
      <path d="M8.5 6.5C10.4 6.5 12 8.1 12 10" />
    </svg>
  ),
  politics: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 10h10M2 10V6M10 10V6M5 10V6M7 10V6" />
      <path d="M1 6h10M6 1l5 5H1z" />
    </svg>
  ),
  history: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 1.5C2 1.5 1 2.3 1 3.2V9c0 1 .8 1.5 1.8 1.5H10c.5 0 1-.5 1-1V3.2c0-.9-1-1.7-2-1.7H3z" />
      <path d="M4 5h4M4 7.5h3" />
    </svg>
  ),
};

type Props = {
  category: PostCategory;
  size?: "sm" | "md";
};

export function CategoryBadge({ category, size = "sm" }: Props) {
  const sizeClass = size === "md"
    ? "px-2.5 py-1 text-xs gap-1.5"
    : "px-2 py-0.5 text-[0.65rem] gap-1";

  return (
    <span
      className={`inline-flex items-center font-sans font-semibold uppercase tracking-widest rounded-sm border border-accent text-accent ${sizeClass}`}
    >
      {ICONS[category]}
      {category}
    </span>
  );
}

export function CategoryBadgeList({
  categories,
  size,
}: {
  categories: PostCategory[];
  size?: "sm" | "md";
}) {
  if (!categories?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((cat) => (
        <CategoryBadge key={cat} category={cat} size={size} />
      ))}
    </div>
  );
}
