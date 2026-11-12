import { generateHtmlFromElements } from "#lib/components/editor/html-generator";

import { elBadge, elButton, elFrame, elHeading, elText } from "./template-element-builders";

import type { CanvasElement, CanvasFrame } from "#lib/components/editor/types";
import type { DefaultTemplateResult } from "./default-templates";

export function getDefaultPageTemplate(title: string): DefaultTemplateResult {
  const safeTitle = title.trim() || "Halaman Baru";
  const elements: CanvasElement[] = [
    elFrame("flexbox-default", "main", undefined, {
      isDefault: true,
      width: 1280,
      height: 760,
      fill: "#ffffff",
      justifyContent: "flex-start"
    }),
    elFrame("page-hero", "Header Halaman", "flexbox-default", {
      fill: "#f8fafc",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderStyle: "solid",
      gap: 16,
      paddingTop: 64,
      paddingBottom: 56,
      paddingLeft: 40,
      paddingRight: 40
    }),
    elBadge("page-badge", "Label Halaman", "page-hero", "HALAMAN KUSTOM"),
    elHeading("page-title", "Judul Halaman", "page-hero", safeTitle, {
      fontSize: 40,
      textAlign: "center"
    }),
    elText(
      "page-subtitle",
      "Subjudul Halaman",
      "page-hero",
      "Konten halaman ini dapat disesuaikan langsung melalui Visual Page Editor.",
      { width: 680, widthMode: "fixed", fontSize: 16, textAlign: "center" }
    ),
    elFrame("page-body", "Konten Utama", "flexbox-default", {
      width: 960,
      widthMode: "fixed",
      alignItems: "flex-start",
      gap: 20,
      paddingTop: 48,
      paddingBottom: 64,
      paddingLeft: 32,
      paddingRight: 32
    }),
    elHeading("page-section-title", "Judul Bagian", "page-body", "Tentang Halaman Ini", {
      fontSize: 24
    }),
    elText(
      "page-section-text",
      "Paragraf Konten",
      "page-body",
      "Gunakan Visual Page Editor untuk menambahkan teks, gambar, tombol, maupun video YouTube pada halaman ini.",
      { fontSize: 15 }
    ),
    elButton("page-cta", "Tombol Kembali", "page-body", "Kembali ke Beranda", "/")
  ];

  const frame: CanvasFrame = { name: safeTitle, width: 1280, height: 760, background: "#ffffff" };
  return {
    title: safeTitle,
    contentJson: JSON.stringify({ elements, frame }),
    contentHtml: generateHtmlFromElements(elements, frame, "page")
  };
}
