"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getSessionId } from "@lib/session";
import {
  createPost,
  updatePost,
  publishPost,
  archivePost,
  revertToDraft,
  schedulePost,
} from "@lib/api/posts";
import { ApiError } from "@lib/api/client";

export async function createPostAction(formData: FormData) {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  const title = formData.get("title") as string;
  const contentRaw = formData.get("content") as string;
  const coverImageKey = formData.get("coverImageKey") as string | null;
  const categoriesRaw = formData.get("categories") as string | null;
  const categories = categoriesRaw ? (JSON.parse(categoriesRaw) as string[]) : [];

  let content: unknown;
  try {
    content = JSON.parse(contentRaw);
  } catch {
    return { error: "Invalid content format." };
  }

  try {
    const res = await createPost({ title, content, coverImageKey, categories }, sessionId);
    redirect(`/dashboard/posts/${res.postId}`);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Failed to create post." };
  }
}

export async function updatePostAction(postId: string, formData: FormData) {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  const title = formData.get("title") as string;
  const contentRaw = formData.get("content") as string;
  const coverImageKey = formData.get("coverImageKey") as string | null;
  const categoriesRaw = formData.get("categories") as string | null;
  const categories = categoriesRaw ? (JSON.parse(categoriesRaw) as string[]) : [];

  let content: unknown;
  try {
    content = JSON.parse(contentRaw);
  } catch {
    return { error: "Invalid content format." };
  }

  try {
    await updatePost(postId, { title, content, coverImageKey, categories }, sessionId);
    redirect("/dashboard");
  } catch (err) {
    if (isRedirectError(err)) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Failed to save post." };
  }
}

export async function publishPostAction(postId: string) {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  try {
    await publishPost(postId, sessionId);
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Failed to publish post." };
  }

  redirect("/dashboard");
}

export async function archivePostAction(postId: string) {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  try {
    await archivePost(postId, sessionId);
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Failed to archive post." };
  }

  redirect("/dashboard");
}

export async function schedulePostAction(postId: string, publishAt: string) {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  try {
    await schedulePost(postId, publishAt, sessionId);
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Failed to schedule post." };
  }

  redirect("/dashboard");
}

export async function revertToDraftAction(postId: string) {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  try {
    await revertToDraft(postId, sessionId);
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Failed to revert post." };
  }

  redirect(`/dashboard/posts/${postId}`);
}

export async function uploadCoverAction(
  postId: string,
  formData: FormData,
): Promise<{ key: string } | { error: string }> {
  const sessionId = await getSessionId();
  if (!sessionId) return { error: "Not authenticated." };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided." };

  const forward = new FormData();
  forward.append("file", file);

  try {
    const res = await fetch(`${process.env.API_URL}/posts/${postId}/cover`, {
      method: "POST",
      headers: { Cookie: `session_id=${sessionId}` },
      body: forward,
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return { error: msg || "Upload failed." };
    }
    const data = (await res.json()) as { key: string };
    return { key: data.key };
  } catch {
    return { error: "Upload failed." };
  }
}
