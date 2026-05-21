import { apiFetch } from "./client";
import type { PublicPost } from "./posts";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  bio: string | null;
  createdAt: string;
};

export type AuthorProfile = {
  id: string;
  name: string;
  profilePic: string | null;
  bio: string | null;
  posts: PublicPost[];
  totalPosts: number;
  totalPages: number;
  page: number;
};

export async function getMe(sessionId: string): Promise<CurrentUser> {
  const res = await apiFetch<CurrentUser>("/users/me", { sessionId });
  return res.data;
}

export async function getPublicAuthor(id: string, page = 1): Promise<AuthorProfile> {
  const res = await apiFetch<AuthorProfile>(`/users/${id}/public?page=${page}`);
  return res.data;
}

export async function updateProfile(
  data: { name?: string; email?: string; profilePic?: string; bio?: string },
  sessionId: string,
): Promise<CurrentUser> {
  const res = await apiFetch<CurrentUser>("/users/me", {
    method: "PATCH",
    body: data,
    sessionId,
  });
  return res.data;
}

export async function changePassword(
  data: { currentPassword: string; newPassword: string },
  sessionId: string,
): Promise<void> {
  await apiFetch<void>("/users/me/password", {
    method: "PATCH",
    body: data,
    sessionId,
  });
}
