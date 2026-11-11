import { fail } from "@sveltejs/kit";
import { and, eq, ne } from "drizzle-orm";

import { getDb } from "../../../../../lib/server/db";
import { users } from "../../../../../lib/server/schema";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (!locals.user) {
    return { user: null };
  }

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
          role: userRow.role,
          createdAt: userRow.createdAt,
          updatedAt: userRow.updatedAt
        }
      : locals.user
  };
};

export const actions: Actions = {
  default: async ({ request, locals, platform }) => {
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
      return fail(400, { error: "Username wajib diisi." });
    }

    if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
      return fail(400, {
        error: "Username hanya boleh 3-30 karakter (huruf, angka, titik, strip, underscore)."
      });
    }

    if (!email) {
      return fail(400, { error: "Alamat email wajib diisi." });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return fail(400, { error: "Format email tidak valid." });
    }

    try {
      const db = getDb(platform?.env?.DB);

      // Pastikan username tidak digunakan oleh user lain
      const existingUsername = await db.query.users.findFirst({
        where: and(eq(users.username, username), ne(users.id, locals.user.id))
      });

      if (existingUsername) {
        return fail(400, { error: "Username ini sudah digunakan oleh akun lain." });
      }

      // Pastikan email tidak digunakan oleh user lain
      const existingUser = await db.query.users.findFirst({
        where: and(eq(users.email, email), ne(users.id, locals.user.id))
      });

      if (existingUser) {
        return fail(400, { error: "Email ini sudah digunakan oleh akun lain." });
      }

      const now = Date.now();
      await db
        .update(users)
        .set({
          username,
          name: name || null,
          email,
          updatedAt: now
        })
        .where(eq(users.id, locals.user.id));

      return {
        success: true,
        message: "Profil akun Anda berhasil diperbarui."
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal memperbarui profil: ${msg}` });
    }
  }
};
