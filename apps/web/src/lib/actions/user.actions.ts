"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSessionId } from "@lib/session";
import { updateProfile, changePassword } from "@lib/api/users";
import { ApiError } from "@lib/api/client";

export async function updateProfileAction(
  _prevState: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  const name = (formData.get("name") as string) || undefined;
  const email = (formData.get("email") as string) || undefined;
  const profilePic = (formData.get("profilePic") as string) || undefined;
  const bio = (formData.get("bio") as string) || undefined;

  try {
    await updateProfile({ name, email, profilePic, bio }, sessionId);
    revalidatePath("/dashboard", "layout");
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return { error: "This email is already in use." };
    }
    return { error: "Failed to update profile." };
  }
}

export async function changePasswordAction(
  _prevState: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    await changePassword({ currentPassword, newPassword }, sessionId);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Current password is incorrect." };
    }
    return { error: "Failed to change password." };
  }
}
