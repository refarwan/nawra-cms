import { getSetting, setSetting } from "./settings";

export interface SiteSettings {
  siteTitle: string;
  siteTagline: string;
  siteDescription: string;
  siteFavicon: string;
  blogAccentColor: string;
}

export const SITE_SETTING_KEYS = {
  title: "site_title",
  tagline: "site_tagline",
  description: "site_description",
  favicon: "site_favicon",
  blogAccentColor: "site_blog_accent_color"
} as const;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: "Nawra CMS",
  siteTagline: "Visual Web Studio & Content Engine",
  siteDescription:
    "Sistem Manajemen Konten (CMS) Visual Modern tanpa koding dengan Turso & S3 CDN.",
  siteFavicon: "",
  blogAccentColor: "#0d99ff"
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const [title, tagline, description, favicon, blogAccentColor] = await Promise.all([
      getSetting(SITE_SETTING_KEYS.title),
      getSetting(SITE_SETTING_KEYS.tagline),
      getSetting(SITE_SETTING_KEYS.description),
      getSetting(SITE_SETTING_KEYS.favicon),
      getSetting(SITE_SETTING_KEYS.blogAccentColor)
    ]);

    return {
      siteTitle: title || DEFAULT_SITE_SETTINGS.siteTitle,
      siteTagline: tagline || DEFAULT_SITE_SETTINGS.siteTagline,
      siteDescription: description || DEFAULT_SITE_SETTINGS.siteDescription,
      siteFavicon: favicon || DEFAULT_SITE_SETTINGS.siteFavicon,
      blogAccentColor: blogAccentColor || DEFAULT_SITE_SETTINGS.blogAccentColor
    };
  } catch (err) {
    console.warn("Failed to read site settings from db, using defaults:", err);
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

export async function saveSiteSettings(input: SiteSettings): Promise<void> {
  await Promise.all([
    setSetting(SITE_SETTING_KEYS.title, input.siteTitle.trim()),
    setSetting(SITE_SETTING_KEYS.tagline, input.siteTagline.trim()),
    setSetting(SITE_SETTING_KEYS.description, input.siteDescription.trim()),
    setSetting(SITE_SETTING_KEYS.favicon, input.siteFavicon.trim()),
    setSetting(
      SITE_SETTING_KEYS.blogAccentColor,
      input.blogAccentColor.trim() || DEFAULT_SITE_SETTINGS.blogAccentColor
    )
  ]);
}
