import { fail } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { homepages } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { getDefaultHomeTemplate } from "#lib/server/default-home-template";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  try {
    const db = getDb(platform?.env?.DB);
    await ensureTables(platform?.env?.DB);

    const list = await db.query.homepages.findMany({
      orderBy: [desc(homepages.createdAt)]
    });

    return {
      homepages: list
    };
  } catch (err) {
    console.error("Error loading homepages:", err);
    return {
      homepages: []
    };
  }
};

export const actions: Actions = {
  create: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const title = String(data.get("title") || "").trim();

      if (!title) {
        return fail(400, { error: "Judul home page wajib diisi." });
      }

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      const firstHome = await db.query.homepages.findFirst();
      const isFirst = !firstHome;

      const id = crypto.randomUUID();
      const now = Date.now();
      const template = getDefaultHomeTemplate();

      await db.insert(homepages).values({
        id,
        title,
        contentJson: template.contentJson,
        contentHtml: template.contentHtml,
        isActive: isFirst ? 1 : 0,
        createdAt: now,
        updatedAt: now
      });

      return { success: true };
    } catch (err) {
      console.error("Create homepage error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal membuat home page: ${message}` });
    }
  },

  edit: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");
      const title = String(data.get("title") || "").trim();

      if (!id || !title) {
        return fail(400, { error: "ID dan Judul home page wajib diisi." });
      }

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      await db.update(homepages).set({ title, updatedAt: Date.now() }).where(eq(homepages.id, id));

      return { success: true };
    } catch (err) {
      console.error("Edit homepage error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah home page: ${message}` });
    }
  },

  activate: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");

      if (!id) return fail(400, { error: "ID tidak valid" });

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      await db.update(homepages).set({ isActive: 0 });
      await db.update(homepages).set({ isActive: 1 }).where(eq(homepages.id, id));

      return { success: true };
    } catch (err) {
      console.error("Activate homepage error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengaktifkan home page: ${message}` });
    }
  },

  delete: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");

      if (!id) return fail(400, { error: "ID tidak valid" });

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      const target = await db.query.homepages.findFirst({ where: eq(homepages.id, id) });
      if (target?.isActive) {
        return fail(400, { error: "Home page yang sedang aktif tidak dapat dihapus." });
      }

      await db.delete(homepages).where(eq(homepages.id, id));
      return { success: true };
    } catch (err) {
      console.error("Delete homepage error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal menghapus home page: ${message}` });
    }
  }
};
