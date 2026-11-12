import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { footers, headers, homepages } from "#db/schema";
import { generateHtmlFromElements } from "#lib/components/editor/html-generator";
import { getDefaultHomeTemplate } from "#lib/server/default-home-template";
import { getDefaultFooterTemplate, getDefaultHeaderTemplate } from "#lib/server/default-templates";

import type { CanvasElement, CanvasFrame, EditorTargetType } from "#lib/components/editor/types";
import type { PageServerLoad } from "./$types";

function renderFromJsonOrHtml(
  contentJson: string | null | undefined,
  contentHtml: string | null | undefined,
  targetType: EditorTargetType
): string | null {
  if (contentJson) {
    try {
      const parsed = JSON.parse(contentJson) as {
        elements?: CanvasElement[];
        frame?: CanvasFrame;
      };
      if (Array.isArray(parsed.elements) && parsed.elements.length > 0) {
        return generateHtmlFromElements(parsed.elements, parsed.frame, targetType);
      }
    } catch {
      // Fallback to stored HTML if JSON parsing fails
    }
  }
  return contentHtml || null;
}

export const load: PageServerLoad = async ({ platform }) => {
  let headerHtml: string | null = null;
  let footerHtml: string | null = null;
  let homeHtml: string | null = null;

  try {
    const db = getDb(platform?.env?.DB);
    const activeHeader = await db.query.headers.findFirst({
      where: eq(headers.isActive, 1)
    });
    if (activeHeader) {
      if (
        activeHeader.title === "Header Utama" &&
        (!activeHeader.contentJson?.includes("header-brand") ||
          activeHeader.contentJson?.includes("/dashboard"))
      ) {
        const tpl = getDefaultHeaderTemplate();
        await db
          .update(headers)
          .set({
            contentJson: tpl.contentJson,
            contentHtml: tpl.contentHtml,
            updatedAt: Date.now()
          })
          .where(eq(headers.id, activeHeader.id));
        headerHtml = tpl.contentHtml;
      } else {
        headerHtml = renderFromJsonOrHtml(
          activeHeader.contentJson,
          activeHeader.contentHtml,
          "header"
        );
      }
    }

    const activeFooter = await db.query.footers.findFirst({
      where: eq(footers.isActive, 1)
    });
    if (activeFooter) {
      if (
        activeFooter.title === "Footer Utama" &&
        (!activeFooter.contentJson?.includes("footer-brand") ||
          activeFooter.contentJson?.includes("/dashboard"))
      ) {
        const tpl = getDefaultFooterTemplate();
        await db
          .update(footers)
          .set({
            contentJson: tpl.contentJson,
            contentHtml: tpl.contentHtml,
            updatedAt: Date.now()
          })
          .where(eq(footers.id, activeFooter.id));
        footerHtml = tpl.contentHtml;
      } else {
        footerHtml = renderFromJsonOrHtml(
          activeFooter.contentJson,
          activeFooter.contentHtml,
          "footer"
        );
      }
    }

    const activeHome = await db.query.homepages.findFirst({
      where: eq(homepages.isActive, 1)
    });
    if (activeHome) {
      if (
        activeHome.title === "Beranda Utama" &&
        (!activeHome.contentJson?.includes("hero-editor-image") ||
          activeHome.contentJson?.includes("/dashboard"))
      ) {
        const tpl = getDefaultHomeTemplate();
        await db
          .update(homepages)
          .set({
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
    console.warn("Could not load active header/footer/homepage:", err);
  }

  return {
    headerHtml,
    footerHtml,
    homeHtml,
    serverTimestamp: new Date().toISOString(),
    cfCountry: (platform?.cf?.country as string) ?? "Local/Dev"
  };
};
