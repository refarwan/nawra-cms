import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, cookies }) => {
  if (locals.user) {
    const accessToken = cookies.get("access_token") || null;
    return json({
      authenticated: true,
      user: locals.user,
      accessToken
    });
  }

  return json({
    authenticated: false,
    user: null,
    accessToken: null
  });
};
