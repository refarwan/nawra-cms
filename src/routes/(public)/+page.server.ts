import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { footers, headers, homepages } from "#db/schema";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  let headerHtml: string | null = null;
  let footerHtml: string | null = null;
  let homeHtml: string | null = null;

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

    const activeHome = await db.query.homepages.findFirst({
      where: eq(homepages.isActive, 1)
    });
    if (activeHome) homeHtml = activeHome.contentHtml;
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
