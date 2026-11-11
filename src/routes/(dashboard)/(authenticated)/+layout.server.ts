import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, platform }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  const isCloudflare = Boolean(platform?.cf || platform?.ctx);
  const isD1Connected = Boolean(platform?.env?.DB);

  return {
    user: locals.user,
    isCloudflare,
    isD1Connected
  };
};
