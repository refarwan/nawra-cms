import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

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

  const article = await db.query.articles.findFirst({
    where: and(eq(articles.slug, articleSlug), eq(articles.status, "published"))
  });

  if (!article) {
    error(404, "Artikel Tidak Ditemukan");
  }

  const category = article.categoryId
    ? await db.query.articleCategories.findFirst({
        where: eq(articleCategories.id, article.categoryId)
      })
    : null;

  const expectedCategorySlug = category?.slug ?? "uncategorized";
  if (expectedCategorySlug !== categorySlug) {
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
      category: category
        ? { name: category.name, slug: category.slug }
        : { name: "Tanpa Kategori", slug: "uncategorized" }
    },
    headerHtml,
    footerHtml,
    cfCountry: (platform?.cf?.country as string) ?? "Local/Dev"
  };
};
