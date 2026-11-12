import { fail, redirect } from "@sveltejs/kit";

import { deleteFaviconObject } from "#lib/server/media";
import {
  DEFAULT_SITE_SETTINGS,
  getSiteSettings,
  saveSiteSettings
} from "#lib/server/site-settings";

import type { Actions, PageServerLoad } from "./$types";

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (locals.user?.role !== "admin") {
    throw redirect(303, "/dashboard");
  }

  const siteSettings = await getSiteSettings(platform?.env?.DB);
  return { siteSettings };
};

export const actions: Actions = {
  save: async ({ request, locals, platform }) => {
    if (locals.user?.role !== "admin") {
      return fail(403, {
        error: "Hanya admin yang dapat mengubah pengaturan situs."
      });
    }

    const formData = await request.formData();
    const siteTitle = String(formData.get("siteTitle") ?? "").trim();
    const siteTagline = String(formData.get("siteTagline") ?? "").trim();
    const siteDescription = String(formData.get("siteDescription") ?? "").trim();
    const siteFavicon = String(formData.get("siteFavicon") ?? "").trim();
    const blogAccentColor = String(formData.get("blogAccentColor") ?? "").trim();

    const fieldErrors: {
      siteTitle?: string;
      blogAccentColor?: string;
    } = {};

    if (!siteTitle) {
      fieldErrors.siteTitle = "Judul situs tidak boleh kosong.";
    }

    if (!HEX_COLOR_RE.test(blogAccentColor)) {
      fieldErrors.blogAccentColor = "Gunakan format warna hex 6 digit, misalnya #0d99ff.";
    }

    const values = {
      siteTitle,
      siteTagline,
      siteDescription,
      siteFavicon,
      blogAccentColor
    };

    if (Object.keys(fieldErrors).length > 0) {
      return fail(400, { fieldErrors, values });
    }

    const previous = await getSiteSettings(platform?.env?.DB);

    await saveSiteSettings(
      {
        siteTitle,
        siteTagline,
        siteDescription,
        siteFavicon,
        blogAccentColor: blogAccentColor.toLowerCase()
      },
      platform?.env?.DB
    );

    if (previous.siteFavicon && previous.siteFavicon !== siteFavicon) {
      await deleteFaviconObject(previous.siteFavicon, platform?.env?.MEDIA_BUCKET);
    }

    return {
      success: true,
      message: "Pengaturan situs berhasil disimpan.",
      values: {
        ...values,
        blogAccentColor: blogAccentColor.toLowerCase()
      }
    };
  },

  reset: async ({ locals, platform }) => {
    if (locals.user?.role !== "admin") {
      return fail(403, {
        error: "Hanya admin yang dapat mereset pengaturan situs."
      });
    }

    const previous = await getSiteSettings(platform?.env?.DB);
    await saveSiteSettings({ ...DEFAULT_SITE_SETTINGS }, platform?.env?.DB);

    if (previous.siteFavicon) {
      await deleteFaviconObject(previous.siteFavicon, platform?.env?.MEDIA_BUCKET);
    }

    return {
      success: true,
      message: "Pengaturan situs berhasil direset ke default.",
      values: { ...DEFAULT_SITE_SETTINGS }
    };
  }
};
