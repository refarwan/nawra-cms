import { redirect } from "@sveltejs/kit";

import { validateSessionToken } from "./lib/server/auth";
import { getDb } from "./lib/server/db";

import type { Handle } from "@sveltejs/kit/hooks";

export const handle: Handle = async ({ event, resolve }) => {
  const db = getDb(event.platform?.env?.DB);
  const token = event.cookies.get("session");

  if (!token) {
    event.locals.user = null;
    event.locals.session = null;
  } else {
    const { user, session } = await validateSessionToken(db, token, event.platform?.env?.DB);
    event.locals.user = user;
    event.locals.session = session;
  }

  // Route protection
  const path = event.url.pathname;
  if (path.startsWith("/dashboard") && !event.locals.user) {
    throw redirect(302, `/login?redirect=${encodeURIComponent(path)}`);
  }

  if (path === "/login" && event.locals.user) {
    throw redirect(302, "/dashboard");
  }

  return resolve(event);
};
