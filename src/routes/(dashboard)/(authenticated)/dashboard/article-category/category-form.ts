import { normalizeSlug } from "#lib/utils/slug";

export function parseAndValidateCategory(
  data: FormData,
  requireId: boolean
):
  | { ok: true; value: { id: string; name: string; slug: string; description: string } }
  | { ok: false; error: string; fieldErrors: { name?: string; slug?: string } } {
  const id = String(data.get("id") || "");
  const name = String(data.get("name") || "").trim();
  const rawSlug = String(data.get("slug") || "").trim() || name;
  const description = String(data.get("description") || "").trim();

  if ((requireId && !id) || !name) {
    return {
      ok: false,
      error: requireId ? "ID dan nama kategori wajib diisi." : "Nama kategori wajib diisi.",
      fieldErrors: { name: !name ? "Nama kategori wajib diisi." : undefined }
    };
  }

  const slug = normalizeSlug(rawSlug);
  if (!slug) {
    return {
      ok: false,
      error: "Slug kategori tidak valid.",
      fieldErrors: { slug: "Slug kategori tidak valid." }
    };
  }
  if (slug === "uncategorized") {
    const msg = 'Slug "uncategorized" dicadangkan untuk kategori bawaan.';
    return { ok: false, error: msg, fieldErrors: { slug: msg } };
  }

  return { ok: true, value: { id, name, slug, description } };
}
