import { fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { hashPassword, verifyPassword } from "../../../../../lib/server/crypto";
import { getDb } from "../../../../../lib/server/db";
import { users } from "../../../../../lib/server/schema";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  return {
    user: locals.user
  };
};

export const actions: Actions = {
  default: async ({ request, locals, platform }) => {
    if (!locals.user) {
      return fail(401, { error: "Sesi tidak valid. Silakan login kembali." });
    }

    const data = await request.formData();
    const oldPassword = String(data.get("oldPassword") || "");
    const newPassword = String(data.get("newPassword") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");

    if (!oldPassword || !newPassword || !confirmPassword) {
      return fail(400, { error: "Semua kolom kata sandi wajib diisi." });
    }

    if (newPassword.length < 6) {
      return fail(400, { error: "Kata sandi baru minimal harus 6 karakter." });
    }

    if (newPassword !== confirmPassword) {
      return fail(400, {
        error: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru."
      });
    }

    if (newPassword === oldPassword) {
      return fail(400, {
        error: "Kata sandi baru tidak boleh sama dengan kata sandi saat ini."
      });
    }

    try {
      const db = getDb(platform?.env?.DB);
      const userRow = await db.query.users.findFirst({
        where: eq(users.id, locals.user.id)
      });

      if (!userRow) {
        return fail(404, { error: "Data pengguna tidak ditemukan." });
      }

      const isOldValid = await verifyPassword(oldPassword, userRow.password);
      if (!isOldValid) {
        return fail(400, { error: "Kata sandi saat ini salah." });
      }

      const newPasswordHash = await hashPassword(newPassword);
      await db
        .update(users)
        .set({
          password: newPasswordHash,
          updatedAt: Date.now()
        })
        .where(eq(users.id, locals.user.id));

      return {
        success: true,
        message: "Kata sandi Anda berhasil diperbarui."
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return fail(500, {
        error: `Gagal memperbarui kata sandi: ${msg}`
      });
    }
  }
};
