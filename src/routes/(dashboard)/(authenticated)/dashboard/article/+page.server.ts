import { fail, redirect } from "@sveltejs/kit";
import { and, asc, desc, eq, ne } from "drizzle-orm";

import { getDb } from "#db/index";
import { articleCategories, articles, users } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { getEmptySectionTemplate } from "#lib/server/empty-template";

import { parseAndValidateArticle } from "./article-form";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  try {
    await ensureTables(platform?.env?.DB);
    const db = getDb(platform?.env?.DB);
    const [articleList, categoryList, userList] = await Promise.all([
      db.query.articles.findMany({
        orderBy: [desc(articles.createdAt)]
      }),
      db.query.articleCategories.findMany({
        orderBy: [asc(articleCategories.name)]
      }),
      db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          avatarUrl: users.avatarUrl
        })
        .from(users)
    ]);

    const categoryMap = new Map(categoryList.map((cat) => [cat.id, cat]));
    const userMap = new Map(userList.map((u) => [u.id, u]));

    return {
      articles: articleList.map((item) => {
        const cat = item.categoryId ? categoryMap.get(item.categoryId) : undefined;
        const author = item.authorId ? userMap.get(item.authorId) : undefined;
        return {
          ...item,
          categoryName: cat?.name ?? null,
          categorySlug: cat?.slug ?? "uncategorized",
          authorName: author?.name || author?.username || null,
          authorAvatarUrl: author?.avatarUrl || null
        };
      }),
      categories: categoryList.map((cat) => ({ id: cat.id, name: cat.name, slug: cat.slug }))
    };
  } catch (err) {
    console.error("Error loading articles:", err);
    return { articles: [], categories: [] };
  }
};

export const actions: Actions = {
  create: async ({ request, platform, locals }) => {
    let createdId: string;
    try {
      const parsed = parseAndValidateArticle(await request.formData(), false);
      if (!parsed.ok) {
        return fail(400, { error: parsed.error, fieldErrors: parsed.fieldErrors });
      }
      const { title, slug, excerpt, coverImage, categoryId, status } = parsed.value;

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const existing = await db.query.articles.findFirst({
        where: eq(articles.slug, slug)
      });
      if (existing) {
        const msg = `Slug artikel "${slug}" sudah digunakan.`;
        return fail(400, { error: msg, fieldErrors: { slug: msg } });
      }

      const now = Date.now();
      const template = getEmptySectionTemplate("article", title);
      createdId = crypto.randomUUID();
      await db.insert(articles).values({
        id: createdId,
        title,
        slug,
        excerpt,
        contentJson: template.contentJson,
        contentHtml: template.contentHtml,
        coverImage,
        categoryId,
        authorId: locals.user?.id ?? null,
        status,
        publishedAt: status === "published" ? now : null,
        createdAt: now,
        updatedAt: now
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal membuat artikel: ${message}` });
    }

    throw redirect(303, `/editor?type=article&id=${createdId}`);
  },

  edit: async ({ request, platform }) => {
    try {
      const parsed = parseAndValidateArticle(await request.formData(), true);
      if (!parsed.ok) {
        return fail(400, { error: parsed.error, fieldErrors: parsed.fieldErrors });
      }
      const { id, title, slug, excerpt, coverImage, categoryId, status } = parsed.value;

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const conflict = await db.query.articles.findFirst({
        where: and(eq(articles.slug, slug), ne(articles.id, id))
      });
      if (conflict) {
        const msg = `Slug artikel "${slug}" sudah digunakan.`;
        return fail(400, { error: msg, fieldErrors: { slug: msg } });
      }

      const current = await db.query.articles.findFirst({ where: eq(articles.id, id) });
      const now = Date.now();
      const publishedAt =
        status === "published" ? (current?.publishedAt ?? now) : (current?.publishedAt ?? null);

      await db
        .update(articles)
        .set({
          title,
          slug,
          excerpt,
          coverImage,
          categoryId,
          status,
          publishedAt,
          updatedAt: now
        })
        .where(eq(articles.id, id));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah artikel: ${message}` });
    }
  },

  toggleStatus: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");
      const nextStatus = data.get("status") === "published" ? "published" : "draft";
      if (!id) return fail(400, { error: "ID tidak valid." });

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const now = Date.now();
      await db
        .update(articles)
        .set({
          status: nextStatus,
          ...(nextStatus === "published" ? { publishedAt: now } : {}),
          updatedAt: now
        })
        .where(eq(articles.id, id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah status: ${message}` });
    }
  },

  delete: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");
      if (!id) return fail(400, { error: "ID tidak valid." });

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      await db.delete(articles).where(eq(articles.id, id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal menghapus artikel: ${message}` });
    }
  }
};
