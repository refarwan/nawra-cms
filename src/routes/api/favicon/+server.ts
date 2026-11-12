import { json } from "@sveltejs/kit";

import { getMediaBucket } from "#lib/server/media";
import { getImageExtFromMime, validateUploadedImageFile } from "#lib/server/media-validation";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals, platform }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });
  if (locals.user.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });

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
    const ext = getImageExtFromMime(file.type, file.name);
    const r2Key = `favicons/${crypto.randomUUID()}.${ext}`;
    const buffer = await file.arrayBuffer();

    await bucket.put(r2Key, buffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable"
      }
    });

    return json({ url: `/api/media/${r2Key}` }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: `Gagal mengunggah favicon: ${message}` }, { status: 500 });
  }
};
