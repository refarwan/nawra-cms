import { authStore } from "../stores/auth.svelte";
import { decodeClientJwt } from "../utils/jwt-client";

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/refresh", { credentials: "same-origin" });
    if (!res.ok) {
      authStore.clear();
      return null;
    }
    const data = (await res.json()) as { accessToken?: string };
    if (data.accessToken) {
      authStore.setAccessToken(data.accessToken);
      return data.accessToken;
    }
    authStore.clear();
    return null;
  } catch {
    authStore.clear();
    return null;
  }
}

export async function ensureAccessToken(): Promise<string | null> {
  const token = authStore.accessToken;
  if (!token) return refreshAccessToken();

  const decoded = decodeClientJwt(token);
  const isExpired = !decoded || decoded.exp * 1000 <= Date.now();
  if (isExpired) {
    return refreshAccessToken();
  }

  return token;
}

export async function authorizedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = await ensureAccessToken();
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "same-origin"
  });

  if (response.status === 401) {
    // Retry once with refreshed token if possible
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      headers.set("Authorization", `Bearer ${refreshedToken}`);
      return fetch(input, {
        ...init,
        headers,
        credentials: "same-origin"
      });
    }
  }

  return response;
}
