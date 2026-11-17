import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { pages } from "#db/schema";
import { isSlugReserved } from "#lib/constants/reserved-slugs";
import { ensureTables } from "#lib/server/db";
import { loadActiveHeaderFooterHtml, renderFromJsonOrHtml } from "#lib/server/public-layout-data";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const slug = params.slug?.trim().toLowerCase();

  if (!slug || isSlugReserved(slug)) {
    error(404, "Halaman Tidak Ditemukan");
  }

  await ensureTables();
  const db = getDb();

  const pageRow = await db.query.pages.findFirst({
    where: and(eq(pages.slug, slug), eq(pages.status, "published"))
  });

  if (!pageRow) {
    error(404, "Halaman Tidak Ditemukan");
  }

  const { headerHtml, footerHtml } = await loadActiveHeaderFooterHtml();
  const pageHtml =
    renderFromJsonOrHtml(pageRow.contentJson, pageRow.contentHtml, "page") ||
    pageRow.contentHtml ||
    "";

  return {
    page: {
      id: pageRow.id,
      title: pageRow.title,
      slug: pageRow.slug,
      description: pageRow.description,
      contentHtml: pageHtml
    },
    headerHtml,
    footerHtml,
    cfCountry: "Netlify Edge"
  };
};
