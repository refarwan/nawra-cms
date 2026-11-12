import { desc, eq } from "drizzle-orm";

import { articles } from "../../../../db/schema";
import { ensureTables, getDb } from "../../../../lib/server/db";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, locals }) => {
  const db = getDb(platform?.env?.DB);
  await ensureTables(platform?.env?.DB);

  const user = locals.user;
  const isAdmin = user?.role === "admin";

  if (isAdmin) {
    const [
      allArticles,
      allCategories,
      allPages,
      allImages,
      allUsers,
      headers,
      footers,
      homepages,
      recentArticles
    ] = await Promise.all([
      db.query.articles.findMany({ columns: { id: true, status: true } }),
      db.query.articleCategories.findMany({ columns: { id: true } }),
      db.query.pages.findMany({ columns: { id: true, status: true } }),
      db.query.imageLibrary.findMany({ columns: { id: true } }),
      db.query.users.findMany({ columns: { id: true, role: true } }),
      db.query.headers.findMany({ columns: { id: true, title: true, isActive: true } }),
      db.query.footers.findMany({ columns: { id: true, title: true, isActive: true } }),
      db.query.homepages.findMany({ columns: { id: true, title: true, isActive: true } }),
      db.query.articles.findMany({
        columns: { id: true, title: true, slug: true, status: true, updatedAt: true },
        orderBy: [desc(articles.updatedAt)],
        limit: 5
      })
    ]);

    const publishedArticles = allArticles.filter((a) => a.status === "published").length;
    const publishedPages = allPages.filter((p) => p.status === "published").length;
    const totalEditors = allUsers.filter((u) => u.role === "editor").length;

    const activeHeader = headers.find((h) => h.isActive === 1) ?? null;
    const activeFooter = footers.find((f) => f.isActive === 1) ?? null;
    const activeHome = homepages.find((p) => p.isActive === 1) ?? null;

    return {
      user,
      adminStats: {
        totalArticles: allArticles.length,
        publishedArticles,
        draftArticles: allArticles.length - publishedArticles,
        totalCategories: allCategories.length,
        totalPages: allPages.length,
        publishedPages,
        draftPages: allPages.length - publishedPages,
        totalImages: allImages.length,
        totalEditors,
        totalHomes: homepages.length,
        activeHomeTitle: activeHome?.title ?? "Belum ada yang aktif",
        totalHeaders: headers.length,
        activeHeaderTitle: activeHeader?.title ?? "Belum ada yang aktif",
        totalFooters: footers.length,
        activeFooterTitle: activeFooter?.title ?? "Belum ada yang aktif"
      },
      editorStats: null,
      recentArticles
    };
  }

  const userId = user?.id ?? "";
  const [myArticles, allCategories, allImages, recentArticles] = await Promise.all([
    db.query.articles.findMany({
      where: eq(articles.authorId, userId),
      columns: { id: true, status: true }
    }),
    db.query.articleCategories.findMany({ columns: { id: true, authorId: true } }),
    db.query.imageLibrary.findMany({ columns: { id: true, uploaderId: true } }),
    db.query.articles.findMany({
      where: eq(articles.authorId, userId),
      columns: { id: true, title: true, slug: true, status: true, updatedAt: true },
      orderBy: [desc(articles.updatedAt)],
      limit: 5
    })
  ]);

  const myPublishedArticles = myArticles.filter((a) => a.status === "published").length;
  const myCategories = allCategories.filter((c) => c.authorId === userId).length;
  const myImages = allImages.filter((img) => img.uploaderId === userId).length;

  return {
    user,
    adminStats: null,
    editorStats: {
      myTotalArticles: myArticles.length,
      myPublishedArticles,
      myDraftArticles: myArticles.length - myPublishedArticles,
      myCategories,
      totalCategories: allCategories.length,
      myImages,
      totalImages: allImages.length
    },
    recentArticles
  };
};
