import { deleteFromS3, deleteMultipleFromS3 } from "./s3";

export async function deleteMediaKeys(keys: string[]): Promise<void> {
  await deleteMultipleFromS3(keys);
}

export function extractMediaKeyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  if (url.startsWith("/api/media/")) {
    return url.slice("/api/media/".length);
  }

  const cdnBase = process.env.S3_PUBLIC_CDN_URL?.trim().replace(/\/+$/, "");
  if (cdnBase && url.startsWith(cdnBase)) {
    return url.slice(cdnBase.length).replace(/^\/+/, "");
  }

  const endpoint = process.env.S3_ENDPOINT?.trim().replace(/\/+$/, "");
  const bucket = process.env.S3_BUCKET || "";
  if (endpoint && bucket && url.startsWith(`${endpoint}/${bucket}/`)) {
    return url.slice(`${endpoint}/${bucket}/`.length);
  }

  return null;
}

async function deletePrefixedMediaObject(
  mediaUrl: string | null | undefined,
  prefix: string
): Promise<void> {
  const key = extractMediaKeyFromUrl(mediaUrl);
  if (!key || !key.startsWith(prefix)) return;
  await deleteFromS3(key);
}

export async function deleteAvatarObject(avatarUrl: string | null | undefined): Promise<void> {
  await deletePrefixedMediaObject(avatarUrl, "avatars/");
}

export async function deleteFaviconObject(faviconUrl: string | null | undefined): Promise<void> {
  await deletePrefixedMediaObject(faviconUrl, "favicons/");
}
