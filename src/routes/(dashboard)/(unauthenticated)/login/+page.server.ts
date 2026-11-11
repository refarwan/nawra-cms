import { fail, redirect } from "@sveltejs/kit";

import { loginUser, revokeRefreshToken } from "../../../../lib/server/auth";
import { getDb } from "../../../../lib/server/db";

import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (locals.user) {
    throw redirect(302, "/dashboard");
  }
  const isCloudflare = Boolean(platform?.cf || platform?.ctx);
  const isD1Connected = Boolean(platform?.env?.DB);

  return {
    isCloudflare,
    isD1Connected
  };
};

export const actions: Actions = {
  login: async ({ request, cookies, platform, url }) => {
    const data = await request.formData();
    const identifier = String(data.get("username") || data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    if (!identifier || !password) {
      return fail(400, {
        error: "Username / email dan kata sandi wajib diisi.",
        identifier
      });
    }

    try {
      const db = getDb(platform?.env?.DB);
      const auth = await loginUser(
        db,
        identifier,
        password,
        platform?.env?.JWT_SECRET,
        platform?.env?.DB
      );

      if (!auth) {
        return fail(400, {
          error: "Username/Email atau kata sandi salah. Silakan coba lagi.",
          identifier
        });
      }

      const isSecure = process.env.NODE_ENV === "production" || url.protocol === "https:";

      cookies.set("access_token", auth.accessToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: isSecure,
        maxAge: 15 * 60 // 15 minutes
      });

      cookies.set("refresh_token", auth.refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: isSecure,
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
        identifier
      });
    }
  },

  logout: async ({ cookies, platform }) => {
    try {
      const refreshToken = cookies.get("refresh_token");
      if (refreshToken) {
        const db = getDb(platform?.env?.DB);
        await revokeRefreshToken(db, refreshToken, platform?.env?.DB);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    cookies.delete("access_token", { path: "/" });
    cookies.delete("refresh_token", { path: "/" });
    throw redirect(302, "/login");
  }
};
