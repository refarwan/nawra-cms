import { loadBlogListData } from "#lib/server/blog-data";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
  const data = await loadBlogListData(platform?.env?.DB, params.category);
  return {
    ...data,
    cfCountry: (platform?.cf?.country as string) ?? "Local/Dev"
  };
};
