export const POST_CATEGORIES = [
  "ai",
  "tech",
  "philosophy",
  "sociology",
  "politics",
  "history",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

const DISPLAY_OVERRIDES: Partial<Record<PostCategory, string>> = {
  ai: "AI",
};

export function displayCategory(cat: string): string {
  const override = DISPLAY_OVERRIDES[cat as PostCategory];
  if (override) return override;
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}
