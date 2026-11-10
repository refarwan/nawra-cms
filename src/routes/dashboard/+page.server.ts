import { getDb } from "../../lib/server/db";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, locals }) => {
  const db = getDb(platform?.env?.DB);

  const headersRes = await db
    .prepare("SELECT id, title, is_active FROM headers")
    .all<{ id: string; title: string; is_active: number }>();

  const footersRes = await db
    .prepare("SELECT id, title, is_active FROM footers")
    .all<{ id: string; title: string; is_active: number }>();

  const headers = headersRes.results || [];
  const footers = footersRes.results || [];

  const activeHeader =
    headers.find((h: { is_active: number; title: string }) => h.is_active === 1) || null;
  const activeFooter =
    footers.find((f: { is_active: number; title: string }) => f.is_active === 1) || null;

  return {
    user: locals.user,
    stats: {
      totalHeaders: headers.length,
      activeHeaderTitle: activeHeader?.title ?? "Belum ada yang aktif",
      totalFooters: footers.length,
      activeFooterTitle: activeFooter?.title ?? "Belum ada yang aktif"
    }
  };
};
