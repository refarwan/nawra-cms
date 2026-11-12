import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { articles, footers, headers, homepages, pages } from "#db/schema";
import { ensureTables } from "#lib/server/db";
import { getDefaultHomeTemplate } from "#lib/server/default-home-template";
import { loadActiveHeaderFooterHtml, renderFromJsonOrHtml } from "#lib/server/public-layout-data";

import type { EditorTargetType } from "#lib/components/editor/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, platform, url }) => {
  const rawType = url.searchParams.get("type");
  const type: EditorTargetType | null =
    rawType === "header" ||
    rawType === "footer" ||
    rawType === "homepage" ||
    rawType === "home" ||
    rawType === "page" ||
    rawType === "article"
      ? (rawType as EditorTargetType)
      : null;
  const id = url.searchParams.get("id");

  if (type && id && !locals.user) {
    throw redirect(302, `/login?redirect=${encodeURIComponent(url.pathname + url.search)}`);
  }

  let targetItem: { id: string; title: string; contentJson: string; contentHtml: string } | null =
    null;
  const previewContext: {
    headerHtml: string | null;
    footerHtml: string | null;
    homeHtml: string | null;
  } = { headerHtml: null, footerHtml: null, homeHtml: null };

  if (type && id) {
    try {
      const db = getDb(platform?.env?.DB);
      const layoutData = await loadActiveHeaderFooterHtml(platform?.env?.DB);
      previewContext.headerHtml = layoutData.headerHtml;
      previewContext.footerHtml = layoutData.footerHtml;

      if (type === "header" || type === "footer") {
        const activeHome = await db.query.homepages.findFirst({ where: eq(homepages.isActive, 1) });
        previewContext.homeHtml = activeHome
          ? renderFromJsonOrHtml(activeHome.contentJson, activeHome.contentHtml, "homepage")
          : getDefaultHomeTemplate().contentHtml;
      }
      if (type === "header") {
        const row = await db.query.headers.findFirst({ where: eq(headers.id, id) });
        if (row) {
          targetItem = {
            id: row.id,
            title: row.title || "Header",
            contentJson: row.contentJson || "",
            contentHtml: row.contentHtml || ""
          };
        }
      } else if (type === "footer") {
        const row = await db.query.footers.findFirst({ where: eq(footers.id, id) });
        if (row) {
          targetItem = {
            id: row.id,
            title: row.title || "Footer",
            contentJson: row.contentJson || "",
            contentHtml: row.contentHtml || ""
          };
        }
      } else if (type === "homepage" || type === "home") {
        const row = await db.query.homepages.findFirst({ where: eq(homepages.id, id) });
        if (row) {
          targetItem = {
            id: row.id,
            title: row.title || "Laman Utama",
            contentJson: row.contentJson || "",
            contentHtml: row.contentHtml || ""
          };
        }
      } else if (type === "page") {
        await ensureTables(platform?.env?.DB);
        const row = await db.query.pages.findFirst({ where: eq(pages.id, id) });
        if (row) {
          targetItem = {
            id: row.id,
            title: row.title || "Halaman",
            contentJson: row.contentJson || "",
            contentHtml: row.contentHtml || ""
          };
        }
      } else if (type === "article") {
        await ensureTables(platform?.env?.DB);
        const row = await db.query.articles.findFirst({ where: eq(articles.id, id) });
        if (row) {
          targetItem = {
            id: row.id,
            title: row.title || "Artikel",
            contentJson: row.contentJson || "",
            contentHtml: row.contentHtml || ""
          };
        }
      }
    } catch (err) {
      console.warn("Gagal memuat target header/footer/homepage editor:", err);
    }
  } else {
    const demoTpl = getDefaultHomeTemplate();
    targetItem = {
      id: "",
      title: "Studio Kanvas Publik (Demo)",
      contentJson: demoTpl.contentJson,
      contentHtml: demoTpl.contentHtml
    };
  }

  return {
    targetItem,
    targetType: type,
    previewContext,
    serverTimestamp: new Date().toISOString(),
    cfCountry: (platform?.cf?.country as string) ?? "Local/Dev"
  };
};
