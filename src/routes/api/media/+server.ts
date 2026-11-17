import { json } from "@sveltejs/kit";
import { desc } from "drizzle-orm";

import { getDb } from "#db/index";
import { imageLibrary } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { getImageExtFromMime, validateUploadedImageFile } from "#lib/server/media-validation";
import { uploadToS3 } from "#lib/server/s3";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  await ensureTables();
  const db = getDb();
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

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

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
    const key = `image-library/${id}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const cdnUrl = await uploadToS3({
      key,
      body: buffer,
      contentType: file.type
    });

    await ensureTables();
    const db = getDb();
    const now = Date.now();

    const newItem = {
      id,
      name,
      altText,
      r2Key: key,
      url: cdnUrl,
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
