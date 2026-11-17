import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client | null {
  if (s3ClientInstance) return s3ClientInstance;

  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const region = process.env.S3_REGION || "auto";

  if (!accessKeyId || !secretAccessKey) {
    return null;
  }

  s3ClientInstance = new S3Client({
    endpoint: endpoint || undefined,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    forcePathStyle: Boolean(endpoint)
  });

  return s3ClientInstance;
}

export function getS3BucketName(): string {
  return process.env.S3_BUCKET || "";
}

export function getPublicCdnUrl(key: string): string {
  const cdnBase = process.env.S3_PUBLIC_CDN_URL?.trim().replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");

  if (cdnBase) {
    return `${cdnBase}/${cleanKey}`;
  }

  const endpoint = process.env.S3_ENDPOINT?.trim().replace(/\/+$/, "");
  const bucket = getS3BucketName();
  if (endpoint && bucket) {
    return `${endpoint}/${bucket}/${cleanKey}`;
  }

  return `/api/media/${cleanKey}`;
}

export async function uploadToS3(params: {
  key: string;
  body: Uint8Array | Buffer;
  contentType: string;
}): Promise<string> {
  const client = getS3Client();
  const bucket = getS3BucketName();

  if (!client || !bucket) {
    throw new Error(
      "Kredensial S3 (S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET) belum lengkap di env."
    );
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      CacheControl: "public, max-age=31536000, immutable"
    })
  );

  return getPublicCdnUrl(params.key);
}

export async function deleteFromS3(key: string): Promise<void> {
  const client = getS3Client();
  const bucket = getS3BucketName();
  if (!client || !bucket || !key) return;

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
      })
    );
  } catch (err) {
    console.warn("Failed to delete S3 object:", key, err);
  }
}

export async function deleteMultipleFromS3(keys: string[]): Promise<void> {
  const client = getS3Client();
  const bucket = getS3BucketName();
  const validKeys = keys.filter(Boolean);
  if (!client || !bucket || validKeys.length === 0) return;

  try {
    await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: validKeys.map((k) => ({ Key: k })),
          Quiet: true
        }
      })
    );
  } catch (err) {
    console.warn("Failed to delete multiple S3 objects:", err);
  }
}
