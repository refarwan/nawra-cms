import { json } from "@sveltejs/kit";

import { refreshUserToken } from "../../../../lib/server/auth";
import { getDb } from "../../../../lib/server/db";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies, url }) => {
  const refreshToken = cookies.get("refresh_token");
  if (!refreshToken) {
    return json({ success: false, message: "Refresh token tidak ditemukan." }, { status: 401 });
  }

  const db = getDb();
  const refreshed = await refreshUserToken(db, refreshToken);

  if (!refreshed) {
    cookies.delete("access_token", { path: "/" });
    cookies.delete("refresh_token", { path: "/" });
    return json({ success: false, message: "Sesi telah kedaluwarsa." }, { status: 401 });
  }

  const isSecure = process.env.NODE_ENV === "production" || url.protocol === "https:";

  cookies.set("access_token", refreshed.accessToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
    maxAge: 15 * 60 // 15 minutes
  });

  return json({
    success: true,
    user: refreshed.user,
    accessToken: refreshed.accessToken
  });
};
