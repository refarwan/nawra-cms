import { json } from "@sveltejs/kit";
import { desc } from "drizzle-orm";

import { getDb } from "#db/index";
import { imageLibrary } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { getMediaBucket } from "#lib/server/media";
import { getImageExtFromMime, validateUploadedImageFile } from "#lib/server/media-validation";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, platform, url }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  await ensureTables(platform?.env?.DB);
  const db = getDb(platform?.env?.DB);
  const q = url.searchParams.get("q")?.trim().toLowerCase() || "";

  const rows = await db.query.imageLibrary.findMany({
    orderBy: [desc(imageLibrary.createdAt)]
  });

  const filtered = q
    ? rows.filter(
        (item) => item.name.toLowerCase().includes(q) || item.altText.toLowerCase().includes(q)
      )
    : rows;

  return json({ images: filtered });
};

export const POST: RequestHandler = async ({ request, locals, platform }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  const bucket = getMediaBucket(platform?.env?.MEDIA_BUCKET);
  if (!bucket) {
    return json({ error: "Binding Cloudflare R2 (MEDIA_BUCKET) tidak tersedia." }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const check = validateUploadedImageFile(formData.get("file"));
    if (!check.valid) {
      return json({ error: check.error }, { status: 400 });
    }
    const { file } = check;

    const name = String(formData.get("name") || "").trim() || file.name.replace(/\.[^.]+$/, "");
    const altText = String(formData.get("altText") || "").trim() || name;
    const width = Math.max(0, Number(formData.get("width") || 0));
    const height = Math.max(0, Number(formData.get("height") || 0));
    const isResized = formData.get("isResized") === "1" ? 1 : 0;

    const id = crypto.randomUUID();
    const ext = getImageExtFromMime(file.type, file.name);
    const r2Key = `image-library/${id}.${ext}`;
    const buffer = await file.arrayBuffer();

    await bucket.put(r2Key, buffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable"
      }
    });

    await ensureTables(platform?.env?.DB);
    const db = getDb(platform?.env?.DB);
    const now = Date.now();
    const url = `/api/media/${r2Key}`;

    const newItem = {
      id,
      name,
      altText,
      r2Key,
      url,
      mimeType: file.type,
      size: file.size,
      width,
      height,
      isResized,
      uploaderId: locals.user.id,
      createdAt: now,
      updatedAt: now
    };

    await db.insert(imageLibrary).values(newItem);

    return json({ image: newItem }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: `Gagal mengunggah gambar: ${message}` }, { status: 500 });
  }
};
