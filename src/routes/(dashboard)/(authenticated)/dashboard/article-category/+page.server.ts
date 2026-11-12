import { fail } from "@sveltejs/kit";
import { and, desc, eq, ne, sql } from "drizzle-orm";

import { getDb } from "#db/index";
import { articleCategories, articles, users } from "#db/schema";
import { ensureTables } from "#lib/server/db";

import { parseAndValidateCategory } from "./category-form";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  try {
    await ensureTables(platform?.env?.DB);
    const db = getDb(platform?.env?.DB);
    const [categories, counts, userList] = await Promise.all([
      db.query.articleCategories.findMany({
        orderBy: [desc(articleCategories.createdAt)]
      }),
      db
        .select({
          categoryId: articles.categoryId,
          count: sql<number>`count(*)`
        })
        .from(articles)
        .groupBy(articles.categoryId),
      db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          avatarUrl: users.avatarUrl
        })
        .from(users)
    ]);

    const countMap = new Map<string, number>();
    let uncategorizedCount = 0;
    for (const row of counts) {
      if (row.categoryId) countMap.set(row.categoryId, Number(row.count));
      else uncategorizedCount += Number(row.count);
    }
    const userMap = new Map(userList.map((u) => [u.id, u]));

    return {
      categories: [
        ...categories.map((cat) => {
          const author = cat.authorId ? userMap.get(cat.authorId) : undefined;
          return {
            ...cat,
            articleCount: countMap.get(cat.id) ?? 0,
            authorName: author?.name || author?.username || null,
            authorAvatarUrl: author?.avatarUrl || null,
            isSystem: false
          };
        }),
        {
          id: "uncategorized",
          name: "Tanpa Kategori",
          slug: "uncategorized",
          description: "Artikel yang belum memiliki atau terlepas dari kategori tertentu.",
          authorId: null,
          createdAt: 0,
          updatedAt: 0,
          articleCount: uncategorizedCount,
          authorName: "Sistem",
          authorAvatarUrl: null,
          isSystem: true
        }
      ]
    };
  } catch (err) {
    console.error("Error loading article categories:", err);
    return { categories: [] };
  }
};

export const actions: Actions = {
  create: async ({ request, platform, locals }) => {
    try {
      const parsed = parseAndValidateCategory(await request.formData(), false);
      if (!parsed.ok) {
        return fail(400, { error: parsed.error, fieldErrors: parsed.fieldErrors });
      }
      const { name, slug, description } = parsed.value;

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const existing = await db.query.articleCategories.findFirst({
        where: eq(articleCategories.slug, slug)
      });
      if (existing) {
        const msg = `Slug kategori "/${slug}" sudah digunakan.`;
        return fail(400, { fieldErrors: { slug: msg } });
      }

      const now = Date.now();
      await db.insert(articleCategories).values({
        id: crypto.randomUUID(),
        name,
        slug,
        description,
        authorId: locals.user?.id ?? null,
        createdAt: now,
        updatedAt: now
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal membuat kategori: ${message}` });
    }
  },

  edit: async ({ request, platform }) => {
    try {
      const parsed = parseAndValidateCategory(await request.formData(), true);
      if (!parsed.ok) {
        return fail(400, { error: parsed.error, fieldErrors: parsed.fieldErrors });
      }
      const { id, name, slug, description } = parsed.value;

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      const conflict = await db.query.articleCategories.findFirst({
        where: and(eq(articleCategories.slug, slug), ne(articleCategories.id, id))
      });
      if (conflict) {
        const msg = `Slug kategori "/${slug}" sudah digunakan.`;
        return fail(400, { fieldErrors: { slug: msg } });
      }

      await db
        .update(articleCategories)
        .set({ name, slug, description, updatedAt: Date.now() })
        .where(eq(articleCategories.id, id));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal mengubah kategori: ${message}` });
    }
  },

  delete: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const id = String(data.get("id") || "");
      if (!id || id === "uncategorized") {
        return fail(400, { error: "Kategori bawaan tidak dapat dihapus." });
      }

      await ensureTables(platform?.env?.DB);
      const db = getDb(platform?.env?.DB);
      await db
        .update(articles)
        .set({ categoryId: null, updatedAt: Date.now() })
        .where(eq(articles.categoryId, id));
      await db.delete(articleCategories).where(eq(articleCategories.id, id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, { error: `Gagal menghapus kategori: ${message}` });
    }
  }
};
