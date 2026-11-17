import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { refreshTokens } from "./db/schema";
import { refreshUserToken } from "./lib/server/auth";
import { getDb } from "./lib/server/db";
import { ensureDatabaseReady } from "./lib/server/init-db";
import { verifyJwt } from "./lib/server/jwt";
import { getJwtSecret } from "./lib/server/settings";

import type { Handle, HandleServerError } from "@sveltejs/kit/hooks";
import type { JwtAccessTokenPayload } from "./lib/server/auth";

let isDatabaseReady = false;

export const handle: Handle = async ({ event, resolve }) => {
  const isSecure = process.env.NODE_ENV === "production" || event.url.protocol === "https:";
  const path = event.url.pathname;

  if (!isDatabaseReady) {
    try {
      const ready = await ensureDatabaseReady();
      if (ready) {
        isDatabaseReady = true;
      }
    } catch (err) {
      console.warn("Database initialization check skipped:", err);
    }
  }

  const jwtSecret = await getJwtSecret();

  event.locals.user = null;
  event.locals.session = null;
  event.locals.accessToken = null;

  const accessToken = event.cookies.get("access_token");
  if (accessToken) {
    const payload = await verifyJwt<JwtAccessTokenPayload>(accessToken, jwtSecret);
    if (payload && (!isDatabaseReady || payload.sid)) {
      let isSessionActive = true;
      if (isDatabaseReady && payload.sid) {
        const db = getDb();
        const sessionRow = await db.query.refreshTokens.findFirst({
          where: eq(refreshTokens.id, payload.sid),
          columns: { id: true, expiresAt: true }
        });
        isSessionActive = Boolean(sessionRow && Date.now() < sessionRow.expiresAt);
      }

      if (isSessionActive) {
        event.locals.accessToken = accessToken;
        event.locals.user = {
          id: payload.sub,
          username: payload.username || payload.email.split("@")[0],
          email: payload.email,
          name: payload.name,
          avatarUrl: payload.avatarUrl || "",
          role: payload.role,
          createdAt: payload.iat * 1000
        };
      } else {
        event.cookies.delete("access_token", { path: "/" });
        event.cookies.delete("refresh_token", { path: "/" });
      }
    }
  }

  if (!event.locals.user && isDatabaseReady) {
    const refreshToken = event.cookies.get("refresh_token");
    if (refreshToken) {
      try {
        const db = getDb();
        const refreshed = await refreshUserToken(db, refreshToken, jwtSecret);

        if (refreshed) {
          event.locals.accessToken = refreshed.accessToken;
          event.locals.user = refreshed.user;
          event.cookies.set("access_token", refreshed.accessToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: isSecure,
            maxAge: 15 * 60
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

  if (path.startsWith("/dashboard") && !event.locals.user) {
    const redirectPath = `${event.url.pathname}${event.url.search}`;
    throw redirect(302, `/login?redirect=${encodeURIComponent(redirectPath)}`);
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
