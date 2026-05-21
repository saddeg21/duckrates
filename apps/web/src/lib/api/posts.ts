import { apiFetch } from "./client";
import type { PostCategory } from "@lib/categories";

export type { PostCategory } from "@lib/categories";

export type PublicPost = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  coverImageKey: string | null;
  excerpt: string;
  categories: PostCategory[];
};

export type DashboardPost = {
  id: string;
  title: string;
  status: string;
  categories: PostCategory[];
  createdAt: string;
  updatedAt: string;
};

export type CreatePostResponse = { postId: string };

export type PublicPostDetail = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorProfilePic: string | null;
  publishedAt: string;
  renderedContent: string;
  coverImageKey: string | null;
  categories: PostCategory[];
};

export async function getPublicPost(id: string): Promise<PublicPostDetail> {
  const res = await apiFetch<PublicPostDetail>(`/posts/public/${id}`);
  return res.data;
}

export async function getPublicPosts(): Promise<PublicPost[]> {
  const res = await apiFetch<PublicPost[]>("/posts/public");
  return res.data;
}

export async function getPublicArchive(
  page = 1,
  limit = 10,
): Promise<PaginatedPostsResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const res = await apiFetch<PaginatedPostsResult>(
    `/posts/public/archive?${params}`,
  );
  return res.data;
}

export async function getRandomFeaturedPost(): Promise<PublicPost | null> {
  const res = await apiFetch<PublicPost | null>(
    "/posts/public/random-featured",
  );
  return res.data;
}

export type DashboardPostDetail = {
  id: string;
  title: string;
  status: string;
  categories: PostCategory[];
  content: unknown;
  createdAt: string;
  updatedAt: string;
  coverImageKey: string | null;
};

export async function getDashboardPost(
  id: string,
  sessionId: string,
): Promise<DashboardPostDetail> {
  const res = await apiFetch<DashboardPostDetail>(`/posts/dashboard/${id}`, {
    sessionId,
  });
  return res.data;
}

export type DashboardPostsResult = {
  posts: DashboardPost[];
  page: number;
  totalPages: number;
  total: number;
  statusCounts: Record<string, number>;
};

export async function getDashboardPosts(
  sessionId: string,
  page = 1,
  status?: string,
): Promise<DashboardPostsResult> {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set("status", status);
  const res = await apiFetch<DashboardPostsResult>(
    `/posts/dashboard?${params}`,
    { sessionId },
  );
  return res.data;
}

export async function createPost(
  data: {
    title: string;
    content: unknown;
    coverImageKey?: string | null;
    categories?: string[];
  },
  sessionId: string,
): Promise<CreatePostResponse> {
  const res = await apiFetch<CreatePostResponse>("/posts", {
    method: "POST",
    body: data,
    sessionId,
  });
  return res.data;
}

export async function publishPost(
  postId: string,
  sessionId: string,
): Promise<void> {
  await apiFetch<void>(`/posts/${postId}/publish`, {
    method: "PATCH",
    sessionId,
  });
}

export async function schedulePost(
  postId: string,
  publishAt: string,
  sessionId: string,
): Promise<void> {
  await apiFetch<void>(`/posts/${postId}/schedule`, {
    method: "PATCH",
    body: { publishAt },
    sessionId,
  });
}

export async function archivePost(
  postId: string,
  sessionId: string,
): Promise<void> {
  await apiFetch<void>(`/posts/${postId}/archive`, {
    method: "PATCH",
    sessionId,
  });
}

export async function revertToDraft(
  postId: string,
  sessionId: string,
): Promise<void> {
  await apiFetch<void>(`/posts/${postId}/revert`, {
    method: "PATCH",
    sessionId,
  });
}

export async function updatePost(
  postId: string,
  data: {
    title: string;
    content: unknown;
    coverImageKey?: string | null;
    categories?: string[];
  },
  sessionId: string,
): Promise<{ updatedAt: string }> {
  const res = await apiFetch<{ updatedAt: string }>(`/posts/${postId}`, {
    method: "PATCH",
    body: data,
    sessionId,
  });
  return res.data;
}

export type PaginatedPostsResult = {
  posts: PublicPost[];
  page: number;
  totalPages: number;
  total: number;
};

export async function getPostsByCategory(
  category: string,
  page = 1,
  limit = 5,
): Promise<PaginatedPostsResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const res = await apiFetch<PaginatedPostsResult>(
    `/posts/public/category/${category}?${params}`,
  );
  return res.data;
}
