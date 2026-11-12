import { elBadge, elButton, elFrame, elHeading, elText } from "./template-element-builders";

import type { CanvasElement } from "#lib/components/editor/types";

const FEATURES = [
  [
    "feat-1",
    "Visual Canvas",
    "Kanvas Desain & Auto-Layout",
    "Susun elemen secara bebas atau gunakan Flexbox Baris dan Kolom otomatis dengan pengaturan gap, padding, dan perataan presisi."
  ],
  [
    "feat-2",
    "Layer Tree",
    "Manajemen Hirarki Layer",
    "Kelola struktur halaman secara visual melalui panel layer: ubah urutan via drag-and-drop, kunci posisi, atau sembunyikan elemen."
  ],
  [
    "feat-3",
    "Responsive",
    "Pratinjau 3 Mode Layar",
    "Uji tampilan halaman pada ukuran Desktop (1280px), Tablet (768px), dan Mobile (390px) secara langsung di dalam ruang kerja editor."
  ],
  [
    "feat-4",
    "Style Inspector",
    "Inspektor Properti Lengkap",
    "Atur tipografi, warna latar, garis pinggir, opasitas, hingga tautan tombol secara real-time tanpa perlu menulis satu baris CSS."
  ],
  [
    "feat-5",
    "Rich Media",
    "Embed Gambar & YouTube Instan",
    "Cukup salin dan tempel URL video YouTube biasa atau tautan gambar, dan sistem otomatis mengubahnya menjadi elemen responsif."
  ],
  [
    "feat-6",
    "Edge Database",
    "Penyimpanan Cloudflare D1",
    "Setiap perubahan desain disimpan dalam format JSON dan HTML murni di database serverless Cloudflare D1 yang cepat dan aman."
  ]
] as const;

const WORKFLOW_STEPS = [
  [
    "step-1",
    "Langkah 01",
    "Pilih & Susun Komponen",
    "Tambahkan Flexbox, judul, paragraf, tombol, gambar, atau video YouTube dari dock toolbar bawah langsung ke dalam kanvas.",
    false
  ],
  [
    "step-2",
    "Langkah 02 • Paling Fleksibel",
    "Kustomisasi Gaya Visual",
    "Sesuaikan warna, ukuran font, perataan teks, jarak antar elemen, dan URL tujuan melalui panel inspektor di sisi kanan.",
    true
  ],
  [
    "step-3",
    "Langkah 03",
    "Publikasikan Seketika",
    "Klik tombol Publikasikan untuk menghasilkan kode HTML bersih dan menampilkannya langsung di halaman publik situs Anda.",
    false
  ]
] as const;

export function buildHomeFeatureAndCtaSections(): CanvasElement[] {
  const sectionPad = { paddingTop: 64, paddingBottom: 64, paddingLeft: 40, paddingRight: 40 };
  const gridCfg = {
    width: 1128,
    widthMode: "fixed" as const,
    flexDirection: "row" as const,
    alignItems: "stretch" as const,
    gap: 24
  };

  const els: CanvasElement[] = [
    elFrame("features-section", "Section Fitur Unggulan", "flexbox-default", {
      gap: 36,
      ...sectionPad
    }),
    elFrame("features-header", "Header Fitur", "features-section", {
      width: 680,
      widthMode: "fixed",
      gap: 10
    }),
    elBadge("features-badge", "Label Fitur", "features-header", "FITUR STUDIO"),
    elHeading(
      "features-title",
      "Judul Fitur",
      "features-header",
      "Satu Studio untuk Seluruh Kebutuhan Website",
      { fontSize: 32, textAlign: "center" }
    ),
    elText(
      "features-desc",
      "Deskripsi Fitur",
      "features-header",
      "Dirancang agar kreator, pengembang, dan tim konten dapat membangun halaman web modern dengan cepat.",
      { fontSize: 16, textAlign: "center" }
    ),
    elFrame("features-grid", "Grid Kartu Fitur", "features-section", gridCfg)
  ];

  for (const [id, tag, title, desc] of FEATURES) {
    els.push(
      elFrame(id, `Kartu ${title}`, "features-grid", {
        width: 304,
        widthMode: "fixed",
        fill: "#ffffff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderStyle: "solid",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 10,
        padding: 28
      }),
      elBadge(`${id}-tag`, `Tag ${title}`, id, tag),
      elHeading(`${id}-title`, `Judul ${title}`, id, title, { fontSize: 18, fontWeight: "700" }),
      elText(`${id}-desc`, `Deskripsi ${title}`, id, desc, { fontSize: 14 })
    );
  }

  els.push(
    elFrame("workflow-section", "Section Cara Kerja", "flexbox-default", {
      fill: "#f9fafb",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderStyle: "solid",
      gap: 36,
      ...sectionPad
    }),
    elFrame("workflow-header", "Header Cara Kerja", "workflow-section", {
      width: 680,
      widthMode: "fixed",
      gap: 10
    }),
    elBadge("workflow-badge", "Label Cara Kerja", "workflow-header", "ALUR KERJA"),
    elHeading(
      "workflow-title",
      "Judul Cara Kerja",
      "workflow-header",
      "Cara Membangun Halaman di Nawra CMS",
      { fontSize: 32, textAlign: "center" }
    ),
    elText(
      "workflow-desc",
      "Deskripsi Cara Kerja",
      "workflow-header",
      "Tiga langkah sederhana dari kanvas desain visual hingga halaman aktif di jaringan edge.",
      { fontSize: 16, textAlign: "center" }
    ),
    elFrame("workflow-grid", "Grid Langkah Kerja", "workflow-section", gridCfg)
  );

  for (const [id, step, title, desc, highlight] of WORKFLOW_STEPS) {
    els.push(
      elFrame(id, title, "workflow-grid", {
        width: 304,
        widthMode: "fixed",
        fill: "#ffffff",
        borderRadius: 16,
        borderWidth: highlight ? 2 : 1,
        borderColor: highlight ? "#0d99ff" : "#e5e7eb",
        borderStyle: "solid",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 14,
        padding: 28
      }),
      elBadge(`${id}-badge`, `Badge ${title}`, id, step, {
        fill: highlight ? "#0d99ff" : "#f0f9ff",
        color: highlight ? "#ffffff" : "#0369a1",
        borderColor: highlight ? "#0d99ff" : "#bae6fd"
      }),
      elHeading(`${id}-title`, `Judul ${title}`, id, title, { fontSize: 20, fontWeight: "700" }),
      elText(`${id}-desc`, `Isi ${title}`, id, desc, { fontSize: 14 }),
      elButton(`${id}-btn`, `Tombol ${title}`, id, "Coba di Editor →", "/editor", {
        widthMode: "fill",
        fill: highlight ? "#0d99ff" : "#f3f4f6",
        color: highlight ? "#ffffff" : "#1f2937"
      })
    );
  }

  return els;
}
