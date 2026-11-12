import { fail, redirect } from "@sveltejs/kit";
import { and, desc, eq, ne } from "drizzle-orm";

import { getDb } from "#db/index";
import { pages } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { getEmptySectionTemplate } from "#lib/server/empty-template";
import { validatePageSlug } from "#lib/utils/slug";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (locals.user?.role !== "admin") throw redirect(303, "/dashboard");
  try {
    await ensureTables(platform?.env?.DB);
    const db = getDb(platform?.env?.DB);
    const list = await db.query.pages.findMany({
      orderBy: [desc(pages.createdAt)]
    });
    return { pages: list };
  } catch (err) {
    console.error("Error loading pages:", err);
    return { pages: [] };
  }
};

export const actions: Actions = {
  create: async ({ request, platform }) => {
    let createdId: string;
    try {
      const data = await request.formData();
      const title = String(data.get("title") || "").trim();
      const rawSlug = String(data.get("slug") || "").trim() || title;
      const description = String(data.get("description") || "").trim();
      const status = data.get("status") === "published" ? "published" : "draft";

      if (!title) {
        return fail(400, {
          error: "Judul halaman wajib diisi.",
          fieldErrors: { title: "Judul halaman wajib diisi." }
        });
      }

      const slugCheck = validatePageSlug(rawSlug);
      if (!slugCheck.valid) {
        return fail(400, {
          error: slugCheck.error,
          fieldErrors: { slug: slugCheck.error }
        });
      }

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const existing = await db.query.pages.findFirst({
        where: eq(pages.slug, slugCheck.normalized)
      });
      if (existing) {
        const msg = `Slug "/${slugCheck.normalized}" sudah digunakan.`;
        return fail(400, { error: msg, fieldErrors: { slug: msg } });
      }

      const now = Date.now();
      const template = getEmptySectionTemplate("page", title);
      createdId = crypto.randomUUID();
      await db.insert(pages).values({
        id: createdId,
        title,
        slug: slugCheck.normalized,
        description,
        status,
        contentJson: template.contentJson,
        contentHtml: template.contentHtml,
        createdAt: now,
        updatedAt: now
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal membuat halaman: ${message}` });
    }

    throw redirect(303, `/editor?type=page&id=${createdId}`);
  },

  edit: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");
      const title = String(data.get("title") || "").trim();
      const rawSlug = String(data.get("slug") || "").trim() || title;
      const description = String(data.get("description") || "").trim();
      const status = data.get("status") === "published" ? "published" : "draft";

      if (!id || !title) {
        return fail(400, {
          error: "ID dan judul halaman wajib diisi.",
          fieldErrors: { title: !title ? "Judul halaman wajib diisi." : undefined }
        });
      }

      const slugCheck = validatePageSlug(rawSlug);
      if (!slugCheck.valid) {
        return fail(400, {
          error: slugCheck.error,
          fieldErrors: { slug: slugCheck.error }
        });
      }

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const conflict = await db.query.pages.findFirst({
        where: and(eq(pages.slug, slugCheck.normalized), ne(pages.id, id))
      });
      if (conflict) {
        const msg = `Slug "/${slugCheck.normalized}" sudah digunakan.`;
        return fail(400, { error: msg, fieldErrors: { slug: msg } });
      }

      await db
        .update(pages)
        .set({
          title,
          slug: slugCheck.normalized,
          description,
          status,
          updatedAt: Date.now()
        })
        .where(eq(pages.id, id));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah halaman: ${message}` });
    }
  },

  toggleStatus: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");
      const nextStatus = data.get("status") === "published" ? "published" : "draft";
      if (!id) return fail(400, { error: "ID tidak valid." });

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      await db
        .update(pages)
        .set({ status: nextStatus, updatedAt: Date.now() })
        .where(eq(pages.id, id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah status: ${message}` });
    }
  },

  delete: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");
      if (!id) return fail(400, { error: "ID tidak valid." });

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      await db.delete(pages).where(eq(pages.id, id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal menghapus halaman: ${message}` });
    }
  }
};
