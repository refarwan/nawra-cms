const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml"
]);

const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;

export function getImageExtFromMime(mime: string, filename: string): string {
  if (mime === "image/webp") return "webp";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/gif") return "gif";
  if (mime === "image/avif") return "avif";
  if (mime === "image/svg+xml") return "svg";
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] || "bin";
}

export function validateUploadedImageFile(file: unknown):
  | {
      valid: true;
      file: File;
    }
  | {
      valid: false;
      error: string;
    } {
  if (!(file instanceof File) || file.size === 0) {
    return { valid: false, error: "File gambar wajib dipilih." };
  }
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return { valid: false, error: `Format file "${file.type}" tidak didukung.` };
  }
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return { valid: false, error: "Ukuran file maksimal 10MB." };
  }
  return { valid: true, file };
}
