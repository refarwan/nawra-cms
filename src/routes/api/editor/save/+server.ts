import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { footers, headers, homepages } from "#db/schema";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals, platform }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      type: "header" | "footer" | "homepage" | "home";
      id: string;
      title?: string;
      contentJson: string;
      contentHtml: string;
    };

    const { type, id, title, contentJson, contentHtml } = body;
    if (!type || !id || !contentJson || !contentHtml) {
      return json({ error: "Data editor tidak lengkap." }, { status: 400 });
    }

    const db = getDb(platform?.env?.DB);
    const now = Date.now();

    if (type === "header") {
      const existing = await db.query.headers.findFirst({ where: eq(headers.id, id) });
      if (existing) {
        const updateData: {
          contentJson: string;
          contentHtml: string;
          updatedAt: number;
          title?: string;
        } = { contentJson, contentHtml, updatedAt: now };
        if (title) updateData.title = title;
        await db.update(headers).set(updateData).where(eq(headers.id, id));
      } else {
        await db.insert(headers).values({
          id,
          title: title || "Header Baru",
          contentJson,
          contentHtml,
          isActive: 0,
          createdAt: now,
          updatedAt: now
        });
      }
    } else if (type === "footer") {
      const existing = await db.query.footers.findFirst({ where: eq(footers.id, id) });
      if (existing) {
        const updateData: {
          contentJson: string;
          contentHtml: string;
          updatedAt: number;
          title?: string;
        } = { contentJson, contentHtml, updatedAt: now };
        if (title) updateData.title = title;
        await db.update(footers).set(updateData).where(eq(footers.id, id));
      } else {
        await db.insert(footers).values({
          id,
          title: title || "Footer Baru",
          contentJson,
          contentHtml,
          isActive: 0,
          createdAt: now,
          updatedAt: now
        });
      }
    } else if (type === "homepage" || type === "home") {
      const existing = await db.query.homepages.findFirst({ where: eq(homepages.id, id) });
      if (existing) {
        const updateData: {
          contentJson: string;
          contentHtml: string;
          updatedAt: number;
          title?: string;
        } = { contentJson, contentHtml, updatedAt: now };
        if (title) updateData.title = title;
        await db.update(homepages).set(updateData).where(eq(homepages.id, id));
      } else {
        await db.insert(homepages).values({
          id,
          title: title || "Home Page Baru",
          contentJson,
          contentHtml,
          isActive: 0,
          createdAt: now,
          updatedAt: now
        });
      }
    } else {
      return json({ error: "Tipe target tidak valid." }, { status: 400 });
    }

    return json({ success: true, message: "Konten berhasil disimpan dan dipublikasikan." });
  } catch (err) {
    console.error("Editor save error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: `Gagal menyimpan: ${message}` }, { status: 500 });
  }
};
