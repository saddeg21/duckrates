import { apiFetch } from "./client";

export type RegisterResponse = { userId: string };
export type LoginResponse = { userId: string; sessionId: string };

export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const res = await apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function logout(sessionId: string): Promise<void> {
  await apiFetch<void>("/auth/logout", {
    method: "POST",
    sessionId,
  });
}
