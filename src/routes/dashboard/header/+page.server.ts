import { fail } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";

import { ensureTables, getDb } from "../../../lib/server/db";
import { headers } from "../../../lib/server/schema";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  const db = getDb(platform?.env?.DB);
  await ensureTables(platform?.env?.DB);

  const list = await db.query.headers.findMany({
    orderBy: [desc(headers.createdAt)]
  });

  return {
    headers: list
  };
};

export const actions: Actions = {
  create: async ({ request, platform }) => {
    const data = await request.formData();
    const title = String(data.get("title") || "").trim();

    if (!title) {
      return fail(400, { error: "Judul header wajib diisi." });
    }

    const db = getDb(platform?.env?.DB);
    await ensureTables(platform?.env?.DB);

    const firstHeader = await db.query.headers.findFirst();
    const isFirst = !firstHeader;

    const id = "header-" + Date.now();
    const now = Date.now();
    const defaultContent = JSON.stringify({
      elements: [],
      frame: { width: 1280, height: 100, background: "#ffffff" }
    });
    const isActive = isFirst ? 1 : 0;

    await db.insert(headers).values({
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

    if (!id) return fail(400, { error: "ID header tidak valid." });

    const db = getDb(platform?.env?.DB);
    await db.update(headers).set({ isActive: 0 });
    await db.update(headers).set({ isActive: 1 }).where(eq(headers.id, id));

    return { success: true };
  },

  delete: async ({ request, platform }) => {
    const data = await request.formData();
    const id = String(data.get("id") || "");

    if (!id) return fail(400, { error: "ID header tidak valid." });

    const db = getDb(platform?.env?.DB);
    const target = await db.query.headers.findFirst({
      where: eq(headers.id, id)
    });

    if (target?.isActive === 1) {
      return fail(400, {
        error: "Header yang sedang aktif tidak dapat dihapus. Aktifkan header lain terlebih dahulu."
      });
    }

    await db.delete(headers).where(eq(headers.id, id));
    return { success: true };
  }
};
