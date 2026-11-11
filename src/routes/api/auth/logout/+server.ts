import { json } from "@sveltejs/kit";

import { revokeRefreshToken } from "../../../../lib/server/auth";
import { getDb } from "../../../../lib/server/db";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, platform }) => {
  const refreshToken = cookies.get("refresh_token");
  if (refreshToken) {
    const db = getDb(platform?.env?.DB);
    await revokeRefreshToken(db, refreshToken, platform?.env?.DB);
  }

  cookies.delete("access_token", { path: "/" });
  cookies.delete("refresh_token", { path: "/" });

  return json({ success: true, message: "Berhasil keluar." });
};
