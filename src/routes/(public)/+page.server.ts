import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { homepages } from "#db/schema";
import { getDefaultHomeTemplate } from "#lib/server/default-home-template";
import { loadActiveHeaderFooterHtml, renderFromJsonOrHtml } from "#lib/server/public-layout-data";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const { headerHtml, footerHtml } = await loadActiveHeaderFooterHtml();
  let homeHtml: string | null = null;

  try {
    const db = getDb();
    const activeHome = await db.query.homepages.findFirst({
      where: eq(homepages.isActive, 1)
    });
    if (activeHome) {
      if (
        (activeHome.title === "Beranda Utama" || activeHome.title === "Nawra Laman Utama") &&
        (!activeHome.contentJson?.includes("hero-section") ||
          activeHome.contentJson?.includes("hero-editor-image") ||
          activeHome.contentJson?.includes("#2563eb") ||
          activeHome.contentJson?.includes("/dashboard"))
      ) {
        const tpl = getDefaultHomeTemplate();
        await db
          .update(homepages)
          .set({
            title: tpl.title,
            contentJson: tpl.contentJson,
            contentHtml: tpl.contentHtml,
            updatedAt: Date.now()
          })
          .where(eq(homepages.id, activeHome.id));
        homeHtml = tpl.contentHtml;
      } else {
        homeHtml = renderFromJsonOrHtml(activeHome.contentJson, activeHome.contentHtml, "homepage");
      }
    }
  } catch (err) {
    console.warn("Gagal memuat homepage aktif dari database:", err);
  }

  return {
    headerHtml,
    footerHtml,
    homeHtml,
    cfCountry: "Netlify Edge"
  };
};
