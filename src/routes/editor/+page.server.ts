import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { footers, headers } from "#db/schema";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, platform, url }) => {
  if (!locals.user) {
    throw redirect(302, `/login?redirect=${encodeURIComponent(url.pathname + url.search)}`);
  }

  const type = url.searchParams.get("type") as "header" | "footer" | null;
  const id = url.searchParams.get("id");

  let targetItem: { id: string; title: string; contentJson: string; contentHtml: string } | null =
    null;

  if (type && id) {
    try {
      const db = getDb(platform?.env?.DB);
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
      }
    } catch (err) {
      console.warn("Gagal memuat target header/footer editor:", err);
    }
  }

  return {
    targetItem,
    targetType: type,
    serverTimestamp: new Date().toISOString(),
    cfCountry: (platform?.cf?.country as string) ?? "Local/Dev"
  };
};
