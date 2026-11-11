import { fail } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";

import { ensureTables, getDb } from "../../../../../lib/server/db";
import { footers } from "../../../../../lib/server/schema";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  const db = getDb(platform?.env?.DB);
  await ensureTables(platform?.env?.DB);

  const list = await db.query.footers.findMany({
    orderBy: [desc(footers.createdAt)]
  });

  return {
    footers: list
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
    await ensureTables(platform?.env?.DB);

    const firstFooter = await db.query.footers.findFirst();
    const isFirst = !firstFooter;

    const id = crypto.randomUUID();
    const now = Date.now();
    const defaultContent = JSON.stringify({
      elements: [],
      frame: { width: 1280, height: 240, background: "#111827" }
    });
    const isActive = isFirst ? 1 : 0;

    await db.insert(footers).values({
      id,
      title,
      content: defaultContent,
      isActive,
      createdAt: now,
      updatedAt: now
    });

    return { success: true };
  },

  activate: async ({ request, platform }) => {
    const data = await request.formData();
    const id = String(data.get("id") || "");

    if (!id) return fail(400, { error: "ID footer tidak valid." });

    const db = getDb(platform?.env?.DB);
    await db.update(footers).set({ isActive: 0 });
    await db.update(footers).set({ isActive: 1 }).where(eq(footers.id, id));

    return { success: true };
  },

  delete: async ({ request, platform }) => {
    const data = await request.formData();
    const id = String(data.get("id") || "");

    if (!id) return fail(400, { error: "ID footer tidak valid." });

    const db = getDb(platform?.env?.DB);
    const target = await db.query.footers.findFirst({
      where: eq(footers.id, id)
    });

    if (target?.isActive === 1) {
      return fail(400, {
        error: "Footer yang sedang aktif tidak dapat dihapus. Aktifkan footer lain terlebih dahulu."
      });
    }

    await db.delete(footers).where(eq(footers.id, id));
    return { success: true };
  }
};
