import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { footers, headers } from "#db/schema";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  let headerHtml: string | null = null;
  let footerHtml: string | null = null;

  try {
    const db = getDb(platform?.env?.DB);
    const activeHeader = await db.query.headers.findFirst({
      where: eq(headers.isActive, 1)
    });
    if (activeHeader) headerHtml = activeHeader.contentHtml;

    const activeFooter = await db.query.footers.findFirst({
      where: eq(footers.isActive, 1)
    });
    if (activeFooter) footerHtml = activeFooter.contentHtml;
  } catch (err) {
    console.warn("Could not load active header/footer:", err);
  }

  return {
    headerHtml,
    footerHtml,
    serverTimestamp: new Date().toISOString(),
    cfCountry: (platform?.cf?.country as string) ?? "Local/Dev"
  };
};
