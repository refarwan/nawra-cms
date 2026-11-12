import { normalizeSlug } from "#lib/utils/slug";

export type ArticleFormPayload = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  categoryId: string | null;
  status: "draft" | "published";
};

export function parseAndValidateArticle(
  data: FormData,
  requireId: boolean
):
  | { ok: true; value: ArticleFormPayload }
  | { ok: false; error: string; fieldErrors: { title?: string; slug?: string } } {
  const id = String(data.get("id") || "");
  const title = String(data.get("title") || "").trim();
  const rawSlug = String(data.get("slug") || "").trim() || title;
  const excerpt = String(data.get("excerpt") || "").trim();
  const coverImage = String(data.get("coverImage") || "").trim();
  const categoryId = String(data.get("categoryId") || "").trim() || null;
  const status = data.get("status") === "published" ? "published" : "draft";

  if ((requireId && !id) || !title) {
    return {
      ok: false,
      error: requireId ? "ID dan judul artikel wajib diisi." : "Judul artikel wajib diisi.",
      fieldErrors: { title: !title ? "Judul artikel wajib diisi." : undefined }
    };
  }

  const slug = normalizeSlug(rawSlug);
  if (!slug) {
    return {
      ok: false,
      error: "Slug artikel tidak valid.",
      fieldErrors: { slug: "Slug artikel tidak valid." }
    };
  }

  return {
    ok: true,
    value: { id, title, slug, excerpt, coverImage, categoryId, status }
  };
}
