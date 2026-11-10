import { fail } from "@sveltejs/kit";

import { getDb } from "../../../lib/server/db";

import type { Actions } from "@sveltejs/kit";
import type { FooterRecord } from "../../../lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  const db = getDb(platform?.env?.DB);
  const res = await db
    .prepare("SELECT * FROM footers ORDER BY created_at DESC")
    .all<FooterRecord>();

  return {
    footers: res.results || []
  };
};

export const actions: Actions = {
  create: async ({ request, platform }) => {
    const data = await request.formData();
    const title = String(data.get("title") || "").trim();

    if (!title) {
      return fail(400, { error: "Judul footer wajib diisi." });
    }

    const db = getDb(platform?.env?.DB);
    const existing = await db
      .prepare("SELECT COUNT(*) as count FROM footers")
      .first<{ count: number }>();
    const isFirst = !existing || Number(existing.count) === 0;

    const id = "footer-" + Date.now();
    const now = Date.now();
    const defaultContent = JSON.stringify({
      elements: [],
      frame: { width: 1280, height: 160, background: "#1e1e24" }
    });
    const isActive = isFirst ? 1 : 0;

    await db
      .prepare(
        "INSERT INTO footers (id, title, content, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(id, title, defaultContent, isActive, now, now)
      .run();

    return { success: true };
  },

  activate: async ({ request, platform }) => {
    const data = await request.formData();
    const id = String(data.get("id") || "");

    if (!id) return fail(400, { error: "ID footer tidak valid." });

    const db = getDb(platform?.env?.DB);
    await db.prepare("UPDATE footers SET is_active = 0").run();
    await db.prepare("UPDATE footers SET is_active = 1 WHERE id = ?").bind(id).run();

    return { success: true };
  },

  delete: async ({ request, platform }) => {
    const data = await request.formData();
    const id = String(data.get("id") || "");

    if (!id) return fail(400, { error: "ID footer tidak valid." });

    const db = getDb(platform?.env?.DB);
    const target = await db
      .prepare("SELECT is_active FROM footers WHERE id = ?")
      .bind(id)
      .first<{ is_active: number }>();

    if (target?.is_active === 1) {
      return fail(400, {
        error: "Footer yang sedang aktif tidak dapat dihapus. Aktifkan footer lain terlebih dahulu."
      });
    }

    await db.prepare("DELETE FROM footers WHERE id = ?").bind(id).run();
    return { success: true };
  }
};
