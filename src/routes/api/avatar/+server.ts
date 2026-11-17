import { json } from "@sveltejs/kit";

import { deleteAvatarObject } from "#lib/server/media";
import { getImageExtFromMime, validateUploadedImageFile } from "#lib/server/media-validation";
import { uploadToS3 } from "#lib/server/s3";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const check = validateUploadedImageFile(formData.get("file"));
    if (!check.valid) {
      return json({ error: check.error }, { status: 400 });
    }

    const { file } = check;
    const ext = getImageExtFromMime(file.type, file.name);
    const key = `avatars/${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const cdnUrl = await uploadToS3({
      key,
      body: buffer,
      contentType: file.type
    });

    if (locals.user.avatarUrl) {
      await deleteAvatarObject(locals.user.avatarUrl);
    }

    return json({ url: cdnUrl }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: `Gagal mengunggah foto profil: ${message}` }, { status: 500 });
  }
};
