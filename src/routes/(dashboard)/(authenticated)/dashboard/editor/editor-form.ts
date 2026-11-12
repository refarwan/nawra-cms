import { and, eq, inArray, ne, or } from "drizzle-orm";

import { articleCategories, articles, imageLibrary, users } from "#db/schema";
import { deleteMediaKeys } from "#lib/server/media";

import type { getDb } from "#db/index";

type DbClient = ReturnType<typeof getDb>;

export type EditorFieldErrors = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function parseEditorProfileFields(data: FormData) {
  return {
    name: String(data.get("name") || "").trim(),
    username: String(data.get("username") || "")
      .trim()
      .toLowerCase(),
    email: String(data.get("email") || "")
      .trim()
      .toLowerCase(),
    avatarUrl: String(data.get("avatarUrl") || "").trim()
  };
}

export function validateEditorProfileInput(
  name: string,
  username: string,
  email: string,
  id?: string,
  requireId = false
): { error: string; fieldErrors: EditorFieldErrors } | null {
  if ((requireId && !id) || !name || !username || !email) {
    return {
      error: requireId
        ? "ID, nama, username, dan email wajib diisi."
        : "Nama, username, dan email wajib diisi.",
      fieldErrors: {
        name: !name ? "Nama lengkap wajib diisi." : undefined,
        username: !username ? "Username wajib diisi." : undefined,
        email: !email ? "Email wajib diisi." : undefined
      }
    };
  }
  if (!email.includes("@")) {
    return {
      error: "Format email tidak valid.",
      fieldErrors: { email: "Format email tidak valid." }
    };
  }
  return null;
}

export function validatePasswordPair(
  password: string,
  confirmPassword: string
): { error: string; fieldErrors: EditorFieldErrors } | null {
  if (!password) {
    return {
      error: "Kata sandi wajib diisi.",
      fieldErrors: { password: "Kata sandi wajib diisi." }
    };
  }
  if (password.length < 6) {
    return {
      error: "Kata sandi minimal 6 karakter.",
      fieldErrors: { password: "Kata sandi minimal 6 karakter." }
    };
  }
  if (password !== confirmPassword) {
    return {
      error: "Konfirmasi kata sandi tidak cocok.",
      fieldErrors: { confirmPassword: "Konfirmasi kata sandi tidak cocok." }
    };
  }
  return null;
}

export async function findEditorConflict(
  db: DbClient,
  username: string,
  email: string,
  excludeId?: string
): Promise<{ error: string; fieldErrors: EditorFieldErrors } | null> {
  const identityFilter = or(eq(users.username, username), eq(users.email, email));
  const where = excludeId ? and(ne(users.id, excludeId), identityFilter) : identityFilter;

  const conflict = await db.query.users.findFirst({ where });
  if (!conflict) return null;

  if (conflict.username === username) {
    const error = `Username "${username}" sudah digunakan.`;
    return { error, fieldErrors: { username: error } };
  }
  const error = `Email "${email}" sudah digunakan.`;
  return { error, fieldErrors: { email: error } };
}

export async function deleteEditorOwnedContent(
  db: DbClient,
  editorId: string,
  mediaBucket?: R2Bucket
): Promise<void> {
  const [editorImages, editorCategories] = await Promise.all([
    db
      .select({ r2Key: imageLibrary.r2Key })
      .from(imageLibrary)
      .where(eq(imageLibrary.uploaderId, editorId)),
    db
      .select({ id: articleCategories.id })
      .from(articleCategories)
      .where(eq(articleCategories.authorId, editorId))
  ]);

  const categoryIds = editorCategories.map((c) => c.id);
  if (categoryIds.length > 0) {
    await db
      .update(articles)
      .set({ categoryId: null, updatedAt: Date.now() })
      .where(inArray(articles.categoryId, categoryIds));
    await db.delete(articleCategories).where(eq(articleCategories.authorId, editorId));
  }

  await db.delete(articles).where(eq(articles.authorId, editorId));
  await db.delete(imageLibrary).where(eq(imageLibrary.uploaderId, editorId));
  await deleteMediaKeys(
    editorImages.map((img) => img.r2Key),
    mediaBucket
  );
}
