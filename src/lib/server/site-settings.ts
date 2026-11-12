import { getSetting, setSetting } from "./settings";

export const SITE_SETTING_KEYS = {
  title: "site_title",
  tagline: "site_tagline",
  description: "site_description",
  favicon: "site_favicon",
  blogAccentColor: "blog_accent_color"
} as const;

export const DEFAULT_SITE_SETTINGS = {
  siteTitle: "Nawra CMS",
  siteTagline: "Kumpulan artikel dan informasi terbaru.",
  siteDescription: "Sistem Manajemen Konten (CMS) Visual Modern tanpa koding di Cloudflare Edge.",
  siteFavicon: "",
  blogAccentColor: "#0d99ff"
} as const;

export interface SiteSettings {
  siteTitle: string;
  siteTagline: string;
  siteDescription: string;
  siteFavicon: string;
  blogAccentColor: string;
}

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function normalizeHexColor(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim() ?? "";
  return HEX_COLOR_RE.test(trimmed) ? trimmed.toLowerCase() : fallback;
}

export async function getSiteSettings(d1?: D1Database): Promise<SiteSettings> {
  try {
    const [title, tagline, description, favicon, accent] = await Promise.all([
      getSetting(SITE_SETTING_KEYS.title, d1),
      getSetting(SITE_SETTING_KEYS.tagline, d1),
      getSetting(SITE_SETTING_KEYS.description, d1),
      getSetting(SITE_SETTING_KEYS.favicon, d1),
      getSetting(SITE_SETTING_KEYS.blogAccentColor, d1)
    ]);

    return {
      siteTitle: title?.trim() || DEFAULT_SITE_SETTINGS.siteTitle,
      siteTagline: tagline !== null ? tagline.trim() : DEFAULT_SITE_SETTINGS.siteTagline,
      siteDescription:
        description !== null ? description.trim() : DEFAULT_SITE_SETTINGS.siteDescription,
      siteFavicon: favicon?.trim() ?? DEFAULT_SITE_SETTINGS.siteFavicon,
      blogAccentColor: normalizeHexColor(accent, DEFAULT_SITE_SETTINGS.blogAccentColor)
    };
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

export async function saveSiteSettings(input: SiteSettings, d1?: D1Database): Promise<void> {
  await Promise.all([
    setSetting(SITE_SETTING_KEYS.title, input.siteTitle.trim(), d1),
    setSetting(SITE_SETTING_KEYS.tagline, input.siteTagline.trim(), d1),
    setSetting(SITE_SETTING_KEYS.description, input.siteDescription.trim(), d1),
    setSetting(SITE_SETTING_KEYS.favicon, input.siteFavicon.trim(), d1),
    setSetting(
      SITE_SETTING_KEYS.blogAccentColor,
      normalizeHexColor(input.blogAccentColor, DEFAULT_SITE_SETTINGS.blogAccentColor),
      d1
    )
  ]);
}
