import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (!locals.user) {
    throw redirect(302, "/login?redirect=/editor");
  }

  return {
    serverTimestamp: new Date().toISOString(),
    cfCountry: (platform?.cf?.country as string) ?? "Local/Dev"
  };
};
