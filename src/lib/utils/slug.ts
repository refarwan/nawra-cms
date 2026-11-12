import { isSlugReserved } from "#lib/constants/reserved-slugs";

export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validatePageSlug(rawSlug: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const normalized = normalizeSlug(rawSlug);
  if (!normalized) {
    return { valid: false, normalized: "", error: "Slug halaman wajib diisi." };
  }
  if (isSlugReserved(normalized)) {
    return {
      valid: false,
      normalized,
      error: `Slug "${normalized}" merupakan rute sistem yang dicadangkan dan tidak dapat digunakan.`
    };
  }
  return { valid: true, normalized };
}
