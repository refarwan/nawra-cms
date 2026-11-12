import { fail, redirect } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { users } from "#db/schema";
import { hashPassword } from "#lib/server/crypto";
import { ensureTables } from "#lib/server/db";
import { deleteAvatarObject } from "#lib/server/media";

import {
  deleteEditorOwnedContent,
  findEditorConflict,
  parseEditorProfileFields,
  validateEditorProfileInput,
  validatePasswordPair
} from "./editor-form";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (locals.user?.role !== "admin") throw redirect(303, "/dashboard");

  try {
    await ensureTables(platform?.env?.DB);
    const db = getDb(platform?.env?.DB);
    const editors = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.role, "editor"))
      .orderBy(desc(users.createdAt));

    return { editors };
  } catch (err) {
    console.error("Error loading editors:", err);
    return { editors: [] };
  }
};

export const actions: Actions = {
  create: async ({ request, locals, platform }) => {
    if (locals.user?.role !== "admin") {
      return fail(403, { error: "Akses ditolak. Hanya admin yang dapat menambah editor." });
    }

    try {
      const data = await request.formData();
      const { name, username, email, avatarUrl } = parseEditorProfileFields(data);
      const password = String(data.get("password") || "");
      const confirmPassword = String(data.get("confirmPassword") || "");

      const profileError = validateEditorProfileInput(name, username, email);
      if (profileError) return fail(400, profileError);

      const passwordError = validatePasswordPair(password, confirmPassword);
      if (passwordError) return fail(400, passwordError);

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const conflictError = await findEditorConflict(db, username, email);
      if (conflictError) return fail(400, conflictError);

      const now = Date.now();
      await db.insert(users).values({
        id: crypto.randomUUID(),
        name,
        username,
        email,
        password: await hashPassword(password),
        role: "editor",
        avatarUrl,
        createdAt: now,
        updatedAt: now
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal menambahkan editor: ${message}` });
    }
  },

  edit: async ({ request, locals, platform }) => {
    if (locals.user?.role !== "admin") {
      return fail(403, { error: "Akses ditolak. Hanya admin yang dapat mengubah editor." });
    }

    try {
      const data = await request.formData();
      const id = String(data.get("id") || "").trim();
      const { name, username, email, avatarUrl } = parseEditorProfileFields(data);

      const profileError = validateEditorProfileInput(name, username, email, id, true);
      if (profileError) return fail(400, profileError);

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const conflictError = await findEditorConflict(db, username, email, id);
      if (conflictError) return fail(400, conflictError);

      const existing = await db.query.users.findFirst({
        where: and(eq(users.id, id), eq(users.role, "editor"))
      });

      await db
        .update(users)
        .set({ name, username, email, avatarUrl, updatedAt: Date.now() })
        .where(and(eq(users.id, id), eq(users.role, "editor")));

      if (existing?.avatarUrl && existing.avatarUrl !== avatarUrl) {
        await deleteAvatarObject(existing.avatarUrl, platform?.env?.MEDIA_BUCKET);
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah data editor: ${message}` });
    }
  },

  changePassword: async ({ request, locals, platform }) => {
    if (locals.user?.role !== "admin") {
      return fail(403, { error: "Akses ditolak. Hanya admin yang dapat mengubah kata sandi." });
    }

    try {
      const data = await request.formData();
      const id = String(data.get("id") || "").trim();
      const password = String(data.get("password") || "");
      const confirmPassword = String(data.get("confirmPassword") || "");

      if (!id) return fail(400, { error: "ID editor tidak valid." });
      const passwordError = validatePasswordPair(password, confirmPassword);
      if (passwordError) return fail(400, passwordError);

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);

      await db
        .update(users)
        .set({ password: await hashPassword(password), updatedAt: Date.now() })
        .where(and(eq(users.id, id), eq(users.role, "editor")));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah kata sandi editor: ${message}` });
    }
  },

  delete: async ({ request, locals, platform }) => {
    if (locals.user?.role !== "admin") {
      return fail(403, { error: "Akses ditolak. Hanya admin yang dapat menghapus editor." });
    }

    try {
      const data = await request.formData();
      const id = String(data.get("id") || "").trim();
      if (!id) return fail(400, { error: "ID editor tidak valid." });

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const existing = await db.query.users.findFirst({
        where: and(eq(users.id, id), eq(users.role, "editor"))
      });

      await deleteEditorOwnedContent(db, id, platform?.env?.MEDIA_BUCKET);
      await db.delete(users).where(and(eq(users.id, id), eq(users.role, "editor")));

      if (existing?.avatarUrl) {
        await deleteAvatarObject(existing.avatarUrl, platform?.env?.MEDIA_BUCKET);
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal menghapus editor: ${message}` });
    }
  }
};
