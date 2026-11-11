import { json } from "@sveltejs/kit";

import { loginUser } from "../../../../lib/server/auth";
import { getDb } from "../../../../lib/server/db";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies, platform, url }) => {
  try {
    const body = (await request.json()) as {
      username?: string;
      email?: string;
      identifier?: string;
      password?: string;
    };
    const identifier = String(body.username || body.email || body.identifier || "").trim();
    const password = String(body.password || "");

    if (!identifier || !password) {
      return json(
        { success: false, message: "Username / Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const db = getDb(platform?.env?.DB);
    const auth = await loginUser(
      db,
      identifier,
      password,
      platform?.env?.JWT_SECRET,
      platform?.env?.DB
    );

    if (!auth) {
      return json(
        { success: false, message: "Username, email, atau kata sandi salah. Silakan coba lagi." },
        { status: 401 }
      );
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

    return json({
      success: true,
      user: auth.user,
      accessToken: auth.accessToken
    });
  } catch (err) {
    console.error("API login error:", err);
    return json({ success: false, message: "Terjadi kesalahan internal server." }, { status: 500 });
  }
};
