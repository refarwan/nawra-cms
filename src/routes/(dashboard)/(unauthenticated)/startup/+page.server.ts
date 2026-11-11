import { fail, redirect } from "@sveltejs/kit";

import { checkDatabaseStatus, initializeDatabase } from "../../../../lib/server/init-db";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (locals.user) {
    throw redirect(302, "/dashboard");
  }

  const status = await checkDatabaseStatus(platform?.env?.DB);
  const isCloudflare = Boolean(platform?.cf || platform?.ctx);
  const isD1Connected = Boolean(platform?.env?.DB);

  return {
    isCloudflare,
    isD1Connected,
    isInitialized: status.initialized,
    tablesExist: status.tablesExist,
    adminExists: status.adminExists,
    dbError: status.error
  };
};

export const actions: Actions = {
  initialize: async ({ platform }) => {
    const result = await initializeDatabase(platform?.env?.DB);
    if (!result.success) {
      return fail(500, {
        error: result.message
      });
    }

    return {
      success: true,
      message: result.message
    };
  }
};
