const API_URL = process.env.API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiResponse<T> = {
  data: T;
  headers: Headers;
};

export async function apiFetch<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    sessionId?: string;
  } = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", body, sessionId } = options;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (sessionId) {
    headers["Cookie"] = `session_id=${sessionId}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message =
      typeof errorBody.message === "string"
        ? errorBody.message
        : `Request failed: ${res.status}`;
    throw new ApiError(res.status, message);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const hasBody =
    contentType.includes("application/json") && res.status !== 204;
  const data: T = hasBody ? ((await res.json()) as T) : (undefined as T);

  return { data, headers: res.headers };
}
