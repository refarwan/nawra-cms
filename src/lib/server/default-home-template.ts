import { generateHtmlFromElements } from "#lib/components/editor/html-generator";

import { buildHomeFeatureAndCtaSections } from "./default-home-sections";
import { elBadge, elButton, elFrame, elHeading, elLink, elText } from "./template-element-builders";

import type { CanvasElement, CanvasFrame } from "#lib/components/editor/types";
import type { DefaultTemplateResult } from "./default-templates";

const STATS = [
  ["stat-1", "100%", "Visual Tanpa Koding"],
  ["stat-2", "3 Mode", "Responsif Desktop, Tablet & Mobile"],
  ["stat-3", "< 50ms", "Render Cepat di Cloudflare Edge"],
  ["stat-4", "Real-Time", "Tersimpan Otomatis di Cloudflare D1"]
] as const;

export function getDefaultHomeTemplate(title = "Nawra Laman Utama"): DefaultTemplateResult {
  const heroBtnPad = { paddingTop: 14, paddingBottom: 14, paddingLeft: 24, paddingRight: 24 };
  const secPad = { paddingTop: 64, paddingBottom: 64, paddingLeft: 40, paddingRight: 40 };
  const elements: CanvasElement[] = [
    elFrame("flexbox-default", "main", undefined, {
      isDefault: true,
      width: 1280,
      height: 1800,
      fill: "#ffffff",
      justifyContent: "flex-start"
    }),
    elFrame("promo-banner", "Banner Informasi Atas", "flexbox-default", {
      fill: "#f0f9ff",
      borderWidth: 1,
      borderColor: "#bae6fd",
      borderStyle: "solid",
      flexDirection: "row",
      gap: 10,
      padding: 10
    }),
    elText(
      "promo-text",
      "Teks Promo",
      "promo-banner",
      "Eksplorasi ruang kerja visual tanpa perlu daftar atau login — langsung coba dari browser Anda.",
      { widthMode: "hug", fontSize: 13, fontWeight: "500", color: "#0c4a6e", textAlign: "center" }
    ),
    elLink(
      "promo-link",
      "Tautan Promo",
      "promo-banner",
      "Coba Editor Sekarang →",
      "/editor",
      "#0d99ff",
      "700"
    ),
    elFrame("hero-section", "Hero Section", "flexbox-default", {
      gap: 20,
      ...secPad
    }),
    elFrame("hero-left", "Konten Hero", "hero-section", {
      width: 780,
      widthMode: "fixed",
      alignItems: "center",
      gap: 20
    }),
    elBadge("hero-badge", "Hero Badge", "hero-left", "VISUAL NO-CODE CMS STUDIO"),
    elHeading(
      "hero-title",
      "Hero Title",
      "hero-left",
      "Bangun & Kelola Website Visual Tanpa Koding",
      {
        fontSize: 44,
        textAlign: "center"
      }
    ),
    elText(
      "hero-desc",
      "Hero Description",
      "hero-left",
      "Rancang tata letak header, beranda, dan footer secara langsung di atas kanvas interaktif. Atur Flexbox, warna, tipografi, gambar, dan video YouTube lalu terbitkan ke Cloudflare Edge.",
      { fontSize: 16, textAlign: "center" }
    ),
    elFrame("hero-actions", "Baris Tombol Hero", "hero-left", {
      widthMode: "hug",
      flexDirection: "row",
      justifyContent: "center",
      gap: 12
    }),
    elButton(
      "hero-cta",
      "Tombol Coba Editor",
      "hero-actions",
      "Coba Editor Sekarang",
      "/editor",
      heroBtnPad
    ),
    elButton(
      "hero-features-cta",
      "Tombol Lihat Fitur",
      "hero-actions",
      "Lihat Fitur Studio",
      "#features-section",
      {
        fill: "#ffffff",
        color: "#374151",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderStyle: "solid",
        ...heroBtnPad
      }
    ),
    elText(
      "hero-highlights",
      "Highlight Keunggulan",
      "hero-left",
      "✓ Kanvas Visual Interaktif   •   ✓ Auto-Layout Flexbox   •   ✓ Cloudflare Workers & D1",
      { fontSize: 13, fontWeight: "600", textAlign: "center" }
    ),
    elFrame("stats-section", "Baris Statistik", "flexbox-default", {
      fill: "#f9fafb",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderStyle: "solid",
      flexDirection: "row",
      gap: 24,
      padding: 32
    })
  ];

  for (const [id, val, lbl] of STATS) {
    elements.push(
      elFrame(id, `Stat ${lbl}`, "stats-section", { width: 260, widthMode: "fixed", gap: 6 }),
      elHeading(`${id}-val`, `Nilai ${val}`, id, val, {
        fontSize: 30,
        color: "#0d99ff",
        textAlign: "center"
      }),
      elText(`${id}-lbl`, lbl, id, lbl, { fontSize: 13, fontWeight: "500", textAlign: "center" })
    );
  }

  elements.push(
    ...buildHomeFeatureAndCtaSections(),
    elFrame("cta-wrapper", "Section CTA Bawah", "flexbox-default", secPad),
    elFrame("cta-card", "Kartu Banner CTA", "cta-wrapper", {
      width: 1032,
      widthMode: "fixed",
      fill: "#0d99ff",
      borderRadius: 24,
      gap: 16,
      padding: 50
    }),
    elHeading("cta-title", "Judul CTA", "cta-card", "Siap Mencoba Visual Studio Tanpa Koding?", {
      fontSize: 32,
      color: "#ffffff",
      textAlign: "center"
    }),
    elText(
      "cta-desc",
      "Deskripsi CTA",
      "cta-card",
      "Buka halaman editor publik sekarang dan rasakan langsung kemudahan merancang halaman web secara visual di browser Anda.",
      { width: 680, widthMode: "fixed", fontSize: 16, color: "#e0f2fe", textAlign: "center" }
    ),
    elButton("cta-btn-1", "CTA Coba Editor", "cta-card", "Coba Editor Sekarang", "/editor", {
      fill: "#ffffff",
      color: "#111827"
    })
  );

  const frame: CanvasFrame = { name: title, width: 1280, height: 1800, background: "#ffffff" };
  return {
    title,
    contentJson: JSON.stringify({ elements, frame }),
    contentHtml: generateHtmlFromElements(elements, frame, "homepage")
  };
}
