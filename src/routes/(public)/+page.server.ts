import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { footers, headers, homepages } from "#db/schema";
import { generateHtmlFromElements } from "#lib/components/editor/html-generator";

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
      headerHtml = renderFromJsonOrHtml(
        activeHeader.contentJson,
        activeHeader.contentHtml,
        "header"
      );
    }

    const activeFooter = await db.query.footers.findFirst({
      where: eq(footers.isActive, 1)
    });
    if (activeFooter) {
      footerHtml = renderFromJsonOrHtml(
        activeFooter.contentJson,
        activeFooter.contentHtml,
        "footer"
      );
    }

    const activeHome = await db.query.homepages.findFirst({
      where: eq(homepages.isActive, 1)
    });
    if (activeHome) {
      homeHtml = renderFromJsonOrHtml(activeHome.contentJson, activeHome.contentHtml, "homepage");
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
