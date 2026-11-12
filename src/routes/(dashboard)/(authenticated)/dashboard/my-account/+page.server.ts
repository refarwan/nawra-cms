import { fail } from "@sveltejs/kit";
import { and, eq, ne } from "drizzle-orm";

import { getDb } from "#db/index";
import { users } from "#db/schema";
import { createAccessToken } from "#lib/server/auth";
import { ensureTables } from "#lib/server/db";
import { decodeJwt } from "#lib/server/jwt";
import { deleteAvatarObject } from "#lib/server/media";
import { getJwtSecret } from "#lib/server/settings";

import type { Cookies } from "@sveltejs/kit";
import type { JwtRefreshTokenPayload } from "#lib/server/auth";
import type { AuthUser } from "../../../../../app.d";
import type { Actions, PageServerLoad } from "./$types";

async function refreshSessionCookie(
  cookies: Cookies,
  row: typeof users.$inferSelect,
  urlProtocol: string,
  d1?: D1Database
) {
  const isSecure = process.env.NODE_ENV === "production" || urlProtocol === "https:";
  const user: AuthUser = {
    id: row.id,
    username: row.username,
    email: row.email,
    name: row.name || row.username,
    avatarUrl: row.avatarUrl || "",
    role: row.role,
    createdAt: row.createdAt
  };
  const refreshToken = cookies.get("refresh_token");
  const sid = refreshToken ? decodeJwt<JwtRefreshTokenPayload>(refreshToken)?.jti : undefined;
  const jwtSecret = await getJwtSecret(d1);
  const accessToken = await createAccessToken(user, jwtSecret, sid);
  cookies.set("access_token", accessToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
    maxAge: 15 * 60
  });
}

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (!locals.user) {
    return { user: null };
  }

  await ensureTables(platform?.env?.DB);
  const db = getDb(platform?.env?.DB);
  const userRow = await db.query.users.findFirst({
    where: eq(users.id, locals.user.id)
  });

  return {
    user: userRow
      ? {
          id: userRow.id,
          username: userRow.username,
          email: userRow.email,
          name: userRow.name || "Administrator",
          avatarUrl: userRow.avatarUrl || "",
          role: userRow.role,
          createdAt: userRow.createdAt,
          updatedAt: userRow.updatedAt
        }
      : locals.user
  };
};

export const actions: Actions = {
  updateProfile: async ({ request, locals, platform, cookies, url }) => {
    if (!locals.user) {
      return fail(401, { error: "Sesi tidak valid. Silakan login kembali." });
    }

    const data = await request.formData();
    const username = String(data.get("username") || "")
      .trim()
      .toLowerCase();
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "")
      .trim()
      .toLowerCase();

    if (!username) {
      return fail(400, {
        error: "Username wajib diisi.",
        fieldErrors: { username: "Username wajib diisi." }
      });
    }
    if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
      const msg = "Username hanya boleh 3-30 karakter (huruf, angka, titik, strip, underscore).";
      return fail(400, {
        error: msg,
        fieldErrors: { username: msg }
      });
    }
    if (!email) {
      return fail(400, {
        error: "Alamat email wajib diisi.",
        fieldErrors: { email: "Alamat email wajib diisi." }
      });
    }
    if (!email.includes("@") || !email.includes(".")) {
      return fail(400, {
        error: "Format email tidak valid.",
        fieldErrors: { email: "Format email tidak valid." }
      });
    }

    try {
      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);

      const existingUsername = await db.query.users.findFirst({
        where: and(eq(users.username, username), ne(users.id, locals.user.id))
      });
      if (existingUsername) {
        const msg = "Username ini sudah digunakan oleh akun lain.";
        return fail(400, { error: msg, fieldErrors: { username: msg } });
      }

      const existingUser = await db.query.users.findFirst({
        where: and(eq(users.email, email), ne(users.id, locals.user.id))
      });
      if (existingUser) {
        const msg = "Email ini sudah digunakan oleh akun lain.";
        return fail(400, { error: msg, fieldErrors: { email: msg } });
      }

      const now = Date.now();
      await db
        .update(users)
        .set({ username, name: name || null, email, updatedAt: now })
        .where(eq(users.id, locals.user.id));

      const updatedRow = await db.query.users.findFirst({ where: eq(users.id, locals.user.id) });
      if (updatedRow) {
        await refreshSessionCookie(cookies, updatedRow, url.protocol, platform?.env?.DB);
      }

      return { success: true, message: "Profil akun Anda berhasil diperbarui." };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal memperbarui profil: ${msg}` });
    }
  },

  updateAvatar: async ({ request, locals, platform, cookies, url }) => {
    if (!locals.user) {
      return fail(401, { error: "Sesi tidak valid. Silakan login kembali." });
    }

    const data = await request.formData();
    const avatarUrl = String(data.get("avatarUrl") || "").trim();

    try {
      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const previousRow = await db.query.users.findFirst({ where: eq(users.id, locals.user.id) });

      await db
        .update(users)
        .set({ avatarUrl, updatedAt: Date.now() })
        .where(eq(users.id, locals.user.id));

      if (previousRow?.avatarUrl && previousRow.avatarUrl !== avatarUrl) {
        await deleteAvatarObject(previousRow.avatarUrl, platform?.env?.MEDIA_BUCKET);
      }

      const updatedRow = await db.query.users.findFirst({ where: eq(users.id, locals.user.id) });
      if (updatedRow) {
        await refreshSessionCookie(cookies, updatedRow, url.protocol, platform?.env?.DB);
      }

      return {
        success: true,
        message: avatarUrl ? "Foto profil berhasil diperbarui." : "Foto profil berhasil dihapus."
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal memperbarui foto profil: ${msg}` });
    }
  }
};
