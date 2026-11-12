export interface ProcessedImageResult {
  file: File;
  width: number;
  height: number;
  isResized: boolean;
}

export interface ResizeImageOptions {
  resize: boolean;
  maxWidth?: number;
  quality?: number;
}

export const RESIZE_WIDTH_PRESETS = [800, 1280, 1600, 1920] as const;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gagal membaca dimensi gambar."));
    };
    img.src = objectUrl;
  });
}

export async function processImageForUpload(
  file: File,
  options: ResizeImageOptions
): Promise<ProcessedImageResult> {
  const isVectorOrAnimated = file.type === "image/svg+xml" || file.type === "image/gif";
  const img = await loadImageElement(file);
  const origWidth = img.naturalWidth || 0;
  const origHeight = img.naturalHeight || 0;

  if (!options.resize || isVectorOrAnimated || origWidth === 0 || origHeight === 0) {
    return {
      file,
      width: origWidth,
      height: origHeight,
      isResized: false
    };
  }

  const maxWidth = options.maxWidth ?? 1600;
  const quality = options.quality ?? 0.85;
  const scale = origWidth > maxWidth ? maxWidth / origWidth : 1;
  const targetWidth = Math.max(1, Math.round(origWidth * scale));
  const targetHeight = Math.max(1, Math.round(origHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { file, width: origWidth, height: origHeight, isResized: false };
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality)
  );

  if (!blob) {
    return { file, width: origWidth, height: origHeight, isResized: false };
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  const resizedFile = new File([blob], `${baseName}.webp`, { type: "image/webp" });

  return {
    file: resizedFile,
    width: targetWidth,
    height: targetHeight,
    isResized: true
  };
}
