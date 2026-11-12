import { error } from "@sveltejs/kit";
import { asc, desc, eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { articleCategories, articles } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { loadActiveHeaderFooterHtml } from "#lib/server/public-layout-data";

function extractShortDescription(excerpt: string, contentHtml: string, maxLength = 150): string {
  const trimmedExcerpt = excerpt.trim();
  if (trimmedExcerpt) return trimmedExcerpt;

  const plainText = contentHtml
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

export async function loadBlogListData(d1: D1Database | undefined, categorySlug = "") {
  await ensureTables(d1);
  const db = getDb(d1);

  const [publishedArticles, categories, layout] = await Promise.all([
    db.query.articles.findMany({
      where: eq(articles.status, "published"),
      orderBy: [desc(articles.publishedAt), desc(articles.createdAt)]
    }),
    db.query.articleCategories.findMany({
      orderBy: [asc(articleCategories.name)]
    }),
    loadActiveHeaderFooterHtml(d1)
  ]);

  const normalizedCatSlug = categorySlug.trim().toLowerCase();
  let activeCategory: { id: string; name: string; slug: string; description: string } | null = null;

  if (normalizedCatSlug && normalizedCatSlug !== "uncategorized") {
    const found = categories.find((c) => c.slug === normalizedCatSlug);
    if (!found) {
      error(404, "Kategori Tidak Ditemukan");
    }
    activeCategory = {
      id: found.id,
      name: found.name,
      slug: found.slug,
      description: found.description
    };
  }

  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const filteredArticles =
    normalizedCatSlug === "uncategorized"
      ? publishedArticles.filter((a) => !a.categoryId)
      : activeCategory
        ? publishedArticles.filter((a) => a.categoryId === activeCategory.id)
        : publishedArticles;

  return {
    articles: filteredArticles.map((item) => {
      const cat = item.categoryId ? categoryById.get(item.categoryId) : undefined;
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: extractShortDescription(item.excerpt, item.contentHtml),
        coverImage: item.coverImage,
        publishedAt: item.publishedAt ?? item.createdAt,
        categorySlug: cat?.slug ?? "uncategorized",
        categoryName: cat?.name ?? null
      };
    }),
    categories: [
      ...categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      { id: "uncategorized", name: "Tanpa Kategori", slug: "uncategorized" }
    ],
    activeCategorySlug: normalizedCatSlug,
    activeCategory,
    headerHtml: layout.headerHtml,
    footerHtml: layout.footerHtml
  };
}
