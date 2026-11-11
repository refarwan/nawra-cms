import { ensureTables, getDb } from "../../../../lib/server/db";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, locals }) => {
  const db = getDb(platform?.env?.DB);
  await ensureTables(platform?.env?.DB);

  const headers = await db.query.headers.findMany({
    columns: { id: true, title: true, isActive: true }
  });

  const footers = await db.query.footers.findMany({
    columns: { id: true, title: true, isActive: true }
  });

  const homepages = await db.query.homepages.findMany({
    columns: { id: true, title: true, isActive: true }
  });

  const activeHeader = headers.find((h) => h.isActive === 1) || null;
  const activeFooter = footers.find((f) => f.isActive === 1) || null;
  const activeHome = homepages.find((p) => p.isActive === 1) || null;

  return {
    user: locals.user,
    stats: {
      totalHeaders: headers.length,
      activeHeaderTitle: activeHeader?.title ?? "Belum ada yang aktif",
      totalFooters: footers.length,
      activeFooterTitle: activeFooter?.title ?? "Belum ada yang aktif",
      totalHomes: homepages.length,
      activeHomeTitle: activeHome?.title ?? "Belum ada yang aktif"
    }
  };
};
