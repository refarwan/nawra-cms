import { fail } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { footers } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { getDefaultFooterTemplate } from "#lib/server/default-templates";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  try {
    const db = getDb(platform?.env?.DB);
    await ensureTables(platform?.env?.DB);

    const list = await db.query.footers.findMany({
      orderBy: [desc(footers.createdAt)]
    });

    return {
      footers: list
    };
  } catch (err) {
    console.error("Error loading footers:", err);
    return {
      footers: []
    };
  }
};

export const actions: Actions = {
  create: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const title = String(data.get("title") || "").trim();

      if (!title) {
        return fail(400, { error: "Judul footer wajib diisi." });
      }

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      const firstFooter = await db.query.footers.findFirst();
      const isFirst = !firstFooter;

      const id = crypto.randomUUID();
      const now = Date.now();
      const template = getDefaultFooterTemplate();
      const contentJson = template.contentJson;
      const contentHtml = template.contentHtml;
      const isActive = isFirst ? 1 : 0;

      await db.insert(footers).values({
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
      console.error("Create footer error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal membuat footer: ${message}` });
    }
  },

  edit: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");
      const title = String(data.get("title") || "").trim();

      if (!id || !title) {
        return fail(400, { error: "ID dan Judul footer wajib diisi." });
      }

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      await db.update(footers).set({ title, updatedAt: Date.now() }).where(eq(footers.id, id));

      return { success: true };
    } catch (err) {
      console.error("Edit footer error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah footer: ${message}` });
    }
  },

  activate: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");

      if (!id) return fail(400, { error: "ID tidak valid" });

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      await db.update(footers).set({ isActive: 0 });
      await db.update(footers).set({ isActive: 1 }).where(eq(footers.id, id));

      return { success: true };
    } catch (err) {
      console.error("Activate footer error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengaktifkan footer: ${message}` });
    }
  },

  delete: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");

      if (!id) return fail(400, { error: "ID tidak valid" });

      const db = getDb(platform?.env?.DB);
      await ensureTables(platform?.env?.DB);

      const target = await db.query.footers.findFirst({ where: eq(footers.id, id) });
      if (target?.isActive) {
        return fail(400, { error: "Footer yang sedang aktif tidak dapat dihapus." });
      }

      await db.delete(footers).where(eq(footers.id, id));
      return { success: true };
    } catch (err) {
      console.error("Delete footer error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal menghapus footer: ${message}` });
    }
  }
};
