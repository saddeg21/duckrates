export type PostStatus = "draft" | "scheduled" | "published" | "archived";

export const POST_CATEGORIES = [
  "ai",
  "tech",
  "philosophy",
  "sociology",
  "politics",
  "history",
] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

const ALLOWED_TRANSITIONS: Record<PostStatus, PostStatus[]> = {
  draft: ["scheduled", "published"],
  scheduled: ["published", "draft"],
  published: ["archived"],
  archived: ["draft"],
};

export function canTransition(from: PostStatus, to: PostStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
