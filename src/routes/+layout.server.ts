import { getSiteSettings } from "#lib/server/site-settings";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, platform }) => {
  const isCloudflare = Boolean(platform?.cf || platform?.ctx);
  const isD1Connected = Boolean(platform?.env?.DB);
  const siteSettings = await getSiteSettings(platform?.env?.DB);

  return {
    user: locals.user,
    accessToken: locals.accessToken,
    isCloudflare,
    isD1Connected,
    siteSettings
  };
};
