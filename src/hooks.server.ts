import { redirect } from "@sveltejs/kit";

import { refreshUserToken } from "./lib/server/auth";
import { getDb } from "./lib/server/db";
import { verifyJwt } from "./lib/server/jwt";

import type { Handle } from "@sveltejs/kit/hooks";
import type { JwtAccessTokenPayload } from "./lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  const jwtSecret = event.platform?.env?.JWT_SECRET;
  const isSecure = process.env.NODE_ENV === "production" || event.url.protocol === "https:";

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
  if (!event.locals.user) {
    const refreshToken = event.cookies.get("refresh_token");
    if (refreshToken) {
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
    }
  }

  // 3. Route protection
  const path = event.url.pathname;
  if (path.startsWith("/dashboard") && !event.locals.user) {
    throw redirect(302, `/login?redirect=${encodeURIComponent(path)}`);
  }

  if (path === "/login" && event.locals.user) {
    throw redirect(302, "/dashboard");
  }

  return resolve(event);
};
