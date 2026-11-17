import { json } from "@sveltejs/kit";

import { deleteFaviconObject } from "#lib/server/media";
import { getImageExtFromMime, validateUploadedImageFile } from "#lib/server/media-validation";
import { uploadToS3 } from "#lib/server/s3";
import { getSetting } from "#lib/server/settings";
import { SITE_SETTING_KEYS } from "#lib/server/site-settings";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });
  if (locals.user.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });

  try {
    const formData = await request.formData();
    const check = validateUploadedImageFile(formData.get("file"));
    if (!check.valid) {
      return json({ error: check.error }, { status: 400 });
    }

    const { file } = check;
    const ext = getImageExtFromMime(file.type, file.name);
    const key = `favicons/${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const cdnUrl = await uploadToS3({
      key,
      body: buffer,
      contentType: file.type
    });

    const previousFavicon = await getSetting(SITE_SETTING_KEYS.favicon);
    if (previousFavicon) {
      await deleteFaviconObject(previousFavicon);
    }

    return json({ url: cdnUrl }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: `Gagal mengunggah favicon: ${message}` }, { status: 500 });
  }
};
