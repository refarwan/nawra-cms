import { fail, redirect } from "@sveltejs/kit";

import { authenticateUser, createSession, invalidateSession } from "../../lib/server/auth";
import { getDb } from "../../lib/server/db";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/dashboard");
  }
  return {};
};

export const actions: Actions = {
  login: async ({ request, cookies, platform, url }) => {
    const data = await request.formData();
    const email = String(data.get("email") || "");
    const password = String(data.get("password") || "");

    if (!email.trim() || !password) {
      return fail(400, {
        error: "Email dan kata sandi wajib diisi.",
        email
      });
    }

    try {
      const db = getDb(platform?.env?.DB);
      const user = await authenticateUser(db, email, password, platform?.env?.DB);

      if (!user) {
        return fail(400, {
          error: "Email atau kata sandi salah. Silakan coba lagi.",
          email
        });
      }

      const token = await createSession(db, user.id, platform?.env?.DB);

      cookies.set("session", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production" || url.protocol === "https:",
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      const redirectTo = url.searchParams.get("redirect") || "/dashboard";
      throw redirect(302, redirectTo);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "status" in err && "location" in err) {
        throw err;
      }
      console.error("Login server error:", err);
      const message = err instanceof Error ? err.message : String(err);
      return fail(500, {
        error: `Terjadi kendala saat login: ${message}`,
        email
      });
    }
  },

  logout: async ({ cookies, locals, platform }) => {
    try {
      if (locals.session) {
        const db = getDb(platform?.env?.DB);
        await invalidateSession(db, locals.session.id);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    cookies.delete("session", { path: "/" });
    throw redirect(302, "/login");
  }
};
