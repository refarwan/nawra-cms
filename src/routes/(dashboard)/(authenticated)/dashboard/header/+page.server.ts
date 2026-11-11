import { fail } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { headers } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { getDefaultHeaderTemplate } from "#lib/server/default-templates";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  try {
    const db = getDb(platform?.env?.DB);
    await ensureTables(platform?.env?.DB);

    const list = await db.query.headers.findMany({
      orderBy: [desc(headers.createdAt)]
    });

    return {
      headers: list
    };
  } catch (err) {
    console.error("Error loading headers:", err);
    return {
      headers: []
    };
  }
};

export const actions: Actions = {
  create: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const title = String(data.get("title") || "").trim();

      if (!title) {
        return fail(400, { error: "Judul header wajib diisi." });
      }

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      const firstHeader = await db.query.headers.findFirst();
      const isFirst = !firstHeader;

      const id = crypto.randomUUID();
      const now = Date.now();
      const template = getDefaultHeaderTemplate();
      const contentJson = template.contentJson;
      const contentHtml = template.contentHtml;
      const isActive = isFirst ? 1 : 0;

      await db.insert(headers).values({
        id,
        title,
        contentJson,
        contentHtml,
        isActive,
        createdAt: now,
        updatedAt: now
      });

      return { success: true };
    } catch (err) {
      console.error("Create header error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal membuat header: ${message}` });
    }
  },

  edit: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");
      const title = String(data.get("title") || "").trim();

      if (!id || !title) {
        return fail(400, { error: "ID dan Judul header wajib diisi." });
      }

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      await db.update(headers).set({ title, updatedAt: Date.now() }).where(eq(headers.id, id));

      return { success: true };
    } catch (err) {
      console.error("Edit header error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah header: ${message}` });
    }
  },

  activate: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");

      if (!id) return fail(400, { error: "ID tidak valid" });

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      await db.update(headers).set({ isActive: 0 });
      await db.update(headers).set({ isActive: 1 }).where(eq(headers.id, id));

      return { success: true };
    } catch (err) {
      console.error("Activate header error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengaktifkan header: ${message}` });
    }
  },

  delete: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");

      if (!id) return fail(400, { error: "ID tidak valid" });

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      const target = await db.query.headers.findFirst({ where: eq(headers.id, id) });
      if (target?.isActive) {
        return fail(400, { error: "Header yang sedang aktif tidak dapat dihapus." });
      }

      await db.delete(headers).where(eq(headers.id, id));
      return { success: true };
    } catch (err) {
      console.error("Delete header error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal menghapus header: ${message}` });
    }
  }
};
