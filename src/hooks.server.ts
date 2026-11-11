import { redirect } from "@sveltejs/kit";
import { env } from "cloudflare:workers";

import { refreshUserToken } from "./lib/server/auth";
import { getDb } from "./lib/server/db";
import { ensureDatabaseReady } from "./lib/server/init-db";
import { verifyJwt } from "./lib/server/jwt";
import { getJwtSecret } from "./lib/server/settings";

import type { Handle, HandleServerError } from "@sveltejs/kit/hooks";
import type { JwtAccessTokenPayload } from "./lib/server/auth";

let isDatabaseReady = false;

export const handle: Handle = async ({ event, resolve }) => {
  if (!event.platform) {
    (event as { platform?: App.Platform }).platform =
      globalThis.__sveltekit_cloudflare_platform ?? {
        env: env as App.Platform["env"]
      };
  }

  const isSecure = process.env.NODE_ENV === "production" || event.url.protocol === "https:";
  const path = event.url.pathname;

  // Cek database otomatis: jika belum ada tabel, otomatis buat tabel & register admin
  if (!isDatabaseReady) {
    try {
      const ready = await ensureDatabaseReady(event.platform?.env?.DB);
      if (ready) {
        isDatabaseReady = true;
      }
    } catch (err) {
      console.warn("Database initialization check skipped:", err);
    }
  }

  const jwtSecret = await getJwtSecret(event.platform?.env?.DB);

  event.locals.user = null;
  event.locals.session = null;
  event.locals.accessToken = null;

  // 1. Coba verifikasi Access Token (Stateless via Web Crypto, 0 query D1!)
  const accessToken = event.cookies.get("access_token");
  if (accessToken) {
    const payload = await verifyJwt<JwtAccessTokenPayload>(accessToken, jwtSecret);
    if (payload) {
      event.locals.accessToken = accessToken;
      event.locals.user = {
        id: payload.sub,
        username: payload.username || payload.email.split("@")[0],
        email: payload.email,
        name: payload.name,
        role: payload.role,
        createdAt: payload.iat * 1000
      };
    }
  }

  // 2. Jika Access Token tidak ada atau expired, coba segarkan via Refresh Token
  if (!event.locals.user && isDatabaseReady) {
    const refreshToken = event.cookies.get("refresh_token");
    if (refreshToken) {
      try {
        const db = getDb(event.platform?.env?.DB);
        const refreshed = await refreshUserToken(
          db,
          refreshToken,
          jwtSecret,
          event.platform?.env?.DB
        );

        if (refreshed) {
          event.locals.accessToken = refreshed.accessToken;
          event.locals.user = refreshed.user;
          event.cookies.set("access_token", refreshed.accessToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: isSecure,
            maxAge: 15 * 60 // 15 menit
          });
        } else {
          event.cookies.delete("access_token", { path: "/" });
          event.cookies.delete("refresh_token", { path: "/" });
        }
      } catch (err) {
        console.warn("Refresh token failed, clearing session cookies:", err);
        event.cookies.delete("access_token", { path: "/" });
        event.cookies.delete("refresh_token", { path: "/" });
      }
    }
  }

  // 3. Route protection
  if (path.startsWith("/dashboard") && !event.locals.user) {
    throw redirect(302, `/login?redirect=${encodeURIComponent(path)}`);
  }

  if (path === "/login" && event.locals.user) {
    throw redirect(302, "/dashboard");
  }

  return resolve(event);
};

export const handleError: HandleServerError = async ({ error, event }) => {
  console.error("Unhandled error at", event.url.pathname, error);
  return {
    message: error instanceof Error ? error.message : "Terjadi kesalahan pada server."
  };
};
