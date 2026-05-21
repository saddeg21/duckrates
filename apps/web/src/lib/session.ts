import { cookies } from "next/headers";

export async function getSessionId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("session_id")?.value;
}

export async function getUserId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("user_id")?.value;
}
