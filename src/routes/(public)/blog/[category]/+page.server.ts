import { loadBlogListData } from "#lib/server/blog-data";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const data = await loadBlogListData(params.category);
  return {
    ...data,
    cfCountry: "Netlify Edge"
  };
};
