import { json, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { imageLibrary } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { deleteFromS3, getPublicCdnUrl } from "#lib/server/s3";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const key = params.key;
  if (!key) {
    return new Response("Not Found", { status: 404 });
  }

  const cdnUrl = getPublicCdnUrl(key);
  if (cdnUrl !== `/api/media/${key}`) {
    throw redirect(302, cdnUrl);
  }

  return new Response("Not Found", { status: 404 });
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  const key = params.key;
  if (!key) return json({ error: "Key tidak valid." }, { status: 400 });

  try {
    const body = (await request.json()) as { name?: string; altText?: string };
    const name = body.name?.trim();
    const altText = body.altText?.trim() ?? "";
    if (!name) return json({ error: "Nama gambar wajib diisi." }, { status: 400 });

    await ensureTables();
    const db = getDb();
    await db
      .update(imageLibrary)
      .set({ name, altText, updatedAt: Date.now() })
      .where(eq(imageLibrary.r2Key, key));

    return json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: `Gagal memperbarui gambar: ${message}` }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  const key = params.key;
  if (!key) return json({ error: "Key tidak valid." }, { status: 400 });

  try {
    await deleteFromS3(key);

    await ensureTables();
    const db = getDb();
    await db.delete(imageLibrary).where(eq(imageLibrary.r2Key, key));

    return json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: `Gagal menghapus gambar: ${message}` }, { status: 500 });
  }
};
