import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { imageLibrary } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { getMediaBucket } from "#lib/server/media";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, platform }) => {
  const key = params.key;
  const bucket = getMediaBucket(platform?.env?.MEDIA_BUCKET);
  if (!key || !bucket) {
    return new Response("Not Found", { status: 404 });
  }

  const object = await bucket.get(key);
  if (!object) {
    return new Response("Not Found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
  headers.set("Cache-Control", object.httpMetadata?.cacheControl || "public, max-age=31536000");
  headers.set("ETag", object.etag);

  return new Response(object.body, { headers });
};

export const PATCH: RequestHandler = async ({ params, request, locals, platform }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  const key = params.key;
  if (!key) return json({ error: "Key tidak valid." }, { status: 400 });

  try {
    const body = (await request.json()) as { name?: string; altText?: string };
    const name = body.name?.trim();
    const altText = body.altText?.trim() ?? "";
    if (!name) return json({ error: "Nama gambar wajib diisi." }, { status: 400 });

    await ensureTables(platform?.env?.DB);
    const db = getDb(platform?.env?.DB);
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

export const DELETE: RequestHandler = async ({ params, locals, platform }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  const key = params.key;
  if (!key) return json({ error: "Key tidak valid." }, { status: 400 });

  try {
    const bucket = getMediaBucket(platform?.env?.MEDIA_BUCKET);
    if (bucket) {
      await bucket.delete(key);
    }

    await ensureTables(platform?.env?.DB);
    const db = getDb(platform?.env?.DB);
    await db.delete(imageLibrary).where(eq(imageLibrary.r2Key, key));

    return json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: `Gagal menghapus gambar: ${message}` }, { status: 500 });
  }
};
