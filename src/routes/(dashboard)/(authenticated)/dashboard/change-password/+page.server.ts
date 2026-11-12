import { fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { getDb } from "../../../../../db/index";
import { users } from "../../../../../db/schema";
import { hashPassword, verifyPassword } from "../../../../../lib/server/crypto";

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
      return fail(400, {
        error: "Semua kolom kata sandi wajib diisi.",
        fieldErrors: {
          oldPassword: !oldPassword ? "Kata sandi saat ini wajib diisi." : undefined,
          newPassword: !newPassword ? "Kata sandi baru wajib diisi." : undefined,
          confirmPassword: !confirmPassword ? "Konfirmasi kata sandi wajib diisi." : undefined
        }
      });
    }

    if (newPassword.length < 6) {
      const msg = "Kata sandi baru minimal harus 6 karakter.";
      return fail(400, { error: msg, fieldErrors: { newPassword: msg } });
    }

    if (newPassword !== confirmPassword) {
      const msg = "Konfirmasi kata sandi tidak cocok dengan kata sandi baru.";
      return fail(400, { error: msg, fieldErrors: { confirmPassword: msg } });
    }

    if (newPassword === oldPassword) {
      const msg = "Kata sandi baru tidak boleh sama dengan kata sandi saat ini.";
      return fail(400, { error: msg, fieldErrors: { newPassword: msg } });
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
        const msg = "Kata sandi saat ini salah.";
        return fail(400, { error: msg, fieldErrors: { oldPassword: msg } });
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
