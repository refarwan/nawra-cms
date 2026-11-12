import { generateHtmlFromElements } from "#lib/components/editor/html-generator";

import { elBadge, elButton, elFrame, elHeading, elLink, elText } from "./template-element-builders";

import type { CanvasElement, CanvasFrame } from "#lib/components/editor/types";

export interface DefaultTemplateResult {
  title: string;
  contentJson: string;
  contentHtml: string;
}

export function getDefaultHeaderTemplate(title = "Nawra Header"): DefaultTemplateResult {
  const elements: CanvasElement[] = [
    elFrame("flexbox-default", "header", undefined, {
      isDefault: true,
      width: 1280,
      height: 76,
      fill: "#ffffff",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderStyle: "solid",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 48,
      paddingRight: 48
    }),
    elFrame("header-brand", "Brand Logo", "flexbox-default", {
      widthMode: "hug",
      flexDirection: "row",
      gap: 10
    }),
    elBadge("logo-badge", "Ikon Brand", "header-brand", "N", {
      fill: "#0d99ff",
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "800",
      borderRadius: 10,
      borderColor: "#0d99ff",
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 11,
      paddingRight: 11
    }),
    elHeading("logo-text", "Logo Text", "header-brand", "Nawra CMS", {
      widthMode: "hug",
      fontSize: 19,
      fontWeight: "700"
    }),
    elFrame("header-nav", "Menu Navigasi", "flexbox-default", {
      widthMode: "hug",
      flexDirection: "row",
      gap: 28
    }),
    elLink("nav-home", "Menu Beranda", "header-nav", "Beranda", "/", "#0d99ff", "600"),
    elLink("nav-features", "Menu Fitur", "header-nav", "Fitur Studio", "/#features-section"),
    elLink("nav-workflow", "Menu Cara Kerja", "header-nav", "Cara Kerja", "/#workflow-section"),
    elLink("nav-editor", "Menu Editor Publik", "header-nav", "Live Editor", "/editor"),
    elFrame("header-actions", "Tombol Aksi", "flexbox-default", {
      widthMode: "hug",
      flexDirection: "row",
      gap: 10
    }),
    elButton("hdr-btn-ed", "Tombol Coba Editor", "header-actions", "Coba Editor", "/editor", {
      fontSize: 13,
      borderRadius: 10,
      paddingTop: 9,
      paddingBottom: 9,
      paddingLeft: 16,
      paddingRight: 16
    })
  ];

  const frame: CanvasFrame = { name: title, width: 1280, height: 76, background: "#ffffff" };
  return {
    title,
    contentJson: JSON.stringify({ elements, frame }),
    contentHtml: generateHtmlFromElements(elements, frame, "header")
  };
}

export function getDefaultFooterTemplate(title = "Nawra Footer"): DefaultTemplateResult {
  const year = new Date().getFullYear();
  const elements: CanvasElement[] = [
    elFrame("flexbox-default", "footer", undefined, {
      isDefault: true,
      width: 1280,
      height: 160,
      fill: "#111827",
      borderWidth: 1,
      borderColor: "#1f2937",
      borderStyle: "solid",
      gap: 28,
      paddingTop: 44,
      paddingBottom: 36,
      paddingLeft: 48,
      paddingRight: 48
    }),
    elFrame("footer-top", "Baris Atas Footer", "flexbox-default", {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 32
    }),
    elFrame("footer-brand", "Info Brand Footer", "footer-top", {
      width: 460,
      widthMode: "fixed",
      alignItems: "flex-start",
      gap: 8
    }),
    elHeading("footer-brand-title", "Nama Brand Footer", "footer-brand", "Nawra CMS", {
      fontSize: 18,
      fontWeight: "700",
      color: "#ffffff"
    }),
    elText(
      "footer-brand-desc",
      "Deskripsi Brand Footer",
      "footer-brand",
      "Visual No-Code CMS Studio untuk membangun halaman web responsif dengan cepat dan menyimpannya langsung di jaringan Cloudflare D1.",
      { fontSize: 13, color: "#9ca3af" }
    ),
    elFrame("footer-links", "Tautan Cepat Footer", "footer-top", {
      widthMode: "hug",
      flexDirection: "row",
      gap: 24
    }),
    elLink("ftr-home", "Tautan Beranda", "footer-links", "Beranda", "/", "#d1d5db"),
    elLink(
      "ftr-feat",
      "Tautan Fitur",
      "footer-links",
      "Fitur Studio",
      "/#features-section",
      "#d1d5db"
    ),
    elLink("ftr-ed", "Tautan Editor", "footer-links", "Coba Editor", "/editor", "#d1d5db"),
    elFrame("footer-bottom", "Baris Hak Cipta", "flexbox-default", {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 20,
      borderWidth: 1,
      borderColor: "#1f2937",
      borderStyle: "solid"
    }),
    elText(
      "copyright-text",
      "Copyright Text",
      "footer-bottom",
      `© ${year} Nawra CMS Visual Studio. Seluruh hak cipta dilindungi.`,
      { widthMode: "hug", fontSize: 12, color: "#9ca3af" }
    ),
    elText(
      "footer-tech",
      "Info Infrastruktur",
      "footer-bottom",
      "Cloudflare Workers SSR • D1 Serverless Database",
      { widthMode: "hug", fontSize: 12, color: "#6b7280", textAlign: "right" }
    )
  ];

  const frame: CanvasFrame = { name: title, width: 1280, height: 160, background: "#111827" };
  return {
    title,
    contentJson: JSON.stringify({ elements, frame }),
    contentHtml: generateHtmlFromElements(elements, frame, "footer")
  };
}
