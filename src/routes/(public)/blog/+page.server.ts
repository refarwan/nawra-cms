import { loadBlogListData } from "#lib/server/blog-data";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const data = await loadBlogListData();
  return {
    ...data,
    cfCountry: "Netlify Edge"
  };
};
