import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { footers, headers } from "#db/schema";
import { generateHtmlFromElements } from "#lib/components/editor/html-generator";
import { getDefaultFooterTemplate, getDefaultHeaderTemplate } from "#lib/server/default-templates";

import type { CanvasElement, CanvasFrame, EditorTargetType } from "#lib/components/editor/types";

export function renderFromJsonOrHtml(
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

export async function loadActiveHeaderFooterHtml(d1?: D1Database): Promise<{
  headerHtml: string | null;
  footerHtml: string | null;
}> {
  let headerHtml: string | null = null;
  let footerHtml: string | null = null;

  try {
    const db = getDb(d1);
    const activeHeader = await db.query.headers.findFirst({ where: eq(headers.isActive, 1) });
    if (activeHeader) {
      if (
        (activeHeader.title === "Header Utama" || activeHeader.title === "Nawra Header") &&
        (!activeHeader.contentJson?.includes("header-brand") ||
          activeHeader.contentJson?.includes("#2563eb") ||
          activeHeader.contentJson?.includes("/dashboard"))
      ) {
        const tpl = getDefaultHeaderTemplate();
        await db
          .update(headers)
          .set({
            title: tpl.title,
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

    const activeFooter = await db.query.footers.findFirst({ where: eq(footers.isActive, 1) });
    if (activeFooter) {
      if (
        (activeFooter.title === "Footer Utama" || activeFooter.title === "Nawra Footer") &&
        (!activeFooter.contentJson?.includes("footer-brand") ||
          activeFooter.contentJson?.includes("#2563eb") ||
          activeFooter.contentJson?.includes("/dashboard"))
      ) {
        const tpl = getDefaultFooterTemplate();
        await db
          .update(footers)
          .set({
            title: tpl.title,
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
  } catch (err) {
    console.warn("Gagal memuat header/footer aktif dari D1:", err);
  }

  return { headerHtml, footerHtml };
}
