"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login, logout, register } from "@lib/api/auth";
import { ApiError } from "@lib/api/client";

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await register({ name, email, password });
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return { error: "This email is already in use." };
    }
    return { error: "Registration failed. Please try again." };
  }

  redirect("/login");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  let sessionId: string;
  let userId: string;

  try {
    const res = await login({ email, password });
    sessionId = res.sessionId;
    userId = res.userId;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Invalid email or password." };
    }
    return { error: "Login failed. Please try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  cookieStore.set("user_id", userId, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    try {
      await logout(sessionId);
    } catch {
      // best-effort: clear cookie regardless
    }
    cookieStore.delete("session_id");
    cookieStore.delete("user_id");
  }

  redirect("/login");
}
