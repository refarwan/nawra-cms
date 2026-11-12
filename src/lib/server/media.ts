import { env } from "cloudflare:workers";

export function getMediaBucket(bucket?: R2Bucket): R2Bucket | undefined {
  if (bucket) return bucket;
  try {
    if (env?.MEDIA_BUCKET) return env.MEDIA_BUCKET;
  } catch {
    // Abaikan jika cloudflare:workers diakses di luar request context
  }
  return globalThis.__sveltekit_cloudflare_platform?.env?.MEDIA_BUCKET;
}

/** Hapus beberapa key media di bucket R2 sekaligus. */
export async function deleteMediaKeys(keys: string[], bucketBinding?: R2Bucket): Promise<void> {
  if (keys.length === 0) return;
  const bucket = getMediaBucket(bucketBinding);
  if (!bucket) return;

  await Promise.allSettled(
    keys.filter(Boolean).map(async (key) => {
      try {
        await bucket.delete(key);
      } catch (err) {
        console.warn("Failed to delete media object:", key, err);
      }
    })
  );
}

async function deletePrefixedMediaObject(
  mediaUrl: string | null | undefined,
  urlPrefix: string,
  bucketBinding?: R2Bucket
): Promise<void> {
  if (!mediaUrl || !mediaUrl.startsWith(urlPrefix)) return;
  const key = mediaUrl.slice("/api/media/".length);
  if (!key) return;

  const bucket = getMediaBucket(bucketBinding);
  if (!bucket) return;

  try {
    await bucket.delete(key);
  } catch (err) {
    console.warn("Failed to delete media object:", key, err);
  }
}

/** Hapus file foto profil lama di bucket R2 jika berada di prefix avatars/. */
export async function deleteAvatarObject(
  avatarUrl: string | null | undefined,
  bucketBinding?: R2Bucket
): Promise<void> {
  await deletePrefixedMediaObject(avatarUrl, "/api/media/avatars/", bucketBinding);
}

/** Hapus file favicon lama di bucket R2 jika berada di prefix favicons/. */
export async function deleteFaviconObject(
  faviconUrl: string | null | undefined,
  bucketBinding?: R2Bucket
): Promise<void> {
  await deletePrefixedMediaObject(faviconUrl, "/api/media/favicons/", bucketBinding);
}
