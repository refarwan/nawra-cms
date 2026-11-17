import { getSiteSettings } from "#lib/server/site-settings";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  const isTursoConfigured = Boolean(
    process.env.TURSO_DATABASE_URL && process.env.TURSO_DATABASE_URL !== "file:local.db"
  );
  const isS3Configured = Boolean(
    process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_BUCKET
  );
  const siteSettings = await getSiteSettings();

  return {
    user: locals.user,
    accessToken: locals.accessToken,
    isTursoConfigured,
    isS3Configured,
    siteSettings
  };
};
