import { error } from "@sveltejs/kit";
import { and, eq, isNull } from "drizzle-orm";

import { getDb } from "#db/index";
import { articleCategories, articles } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { loadActiveHeaderFooterHtml, renderFromJsonOrHtml } from "#lib/server/public-layout-data";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
  const categorySlug = params.category?.trim().toLowerCase();
  const articleSlug = params.slug?.trim().toLowerCase();
  if (!categorySlug || !articleSlug) {
    error(404, "Artikel Tidak Ditemukan");
  }

  await ensureTables(platform?.env?.DB);
  const db = getDb(platform?.env?.DB);

  let targetCategoryId: string | null = null;
  let categoryMeta: { name: string; slug: string };

  if (categorySlug !== "uncategorized") {
    const foundCategory = await db.query.articleCategories.findFirst({
      where: eq(articleCategories.slug, categorySlug)
    });
    if (!foundCategory) {
      error(404, "Artikel Tidak Ditemukan");
    }
    targetCategoryId = foundCategory.id;
    categoryMeta = { name: foundCategory.name, slug: foundCategory.slug };
  } else {
    categoryMeta = { name: "Tanpa Kategori", slug: "uncategorized" };
  }

  const article = await db.query.articles.findFirst({
    where: and(
      targetCategoryId ? eq(articles.categoryId, targetCategoryId) : isNull(articles.categoryId),
      eq(articles.slug, articleSlug),
      eq(articles.status, "published")
    )
  });

  if (!article) {
    error(404, "Artikel Tidak Ditemukan");
  }

  const { headerHtml, footerHtml } = await loadActiveHeaderFooterHtml(platform?.env?.DB);
  const contentHtml =
    renderFromJsonOrHtml(article.contentJson, article.contentHtml, "page") ||
    article.contentHtml ||
    "";

  return {
    article: {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      coverImage: article.coverImage,
      contentHtml,
      publishedAt: article.publishedAt ?? article.createdAt,
      category: categoryMeta
    },
    headerHtml,
    footerHtml,
    cfCountry: (platform?.cf?.country as string) ?? "Local/Dev"
  };
};
