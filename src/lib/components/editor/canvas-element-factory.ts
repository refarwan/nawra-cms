import { DEFAULT_YOUTUBE_URL } from "./youtube-utils";

import type { CanvasElement, CanvasFrame, ElementType } from "./types";

export const INITIAL_FRAME: CanvasFrame = {
  name: "Kanvas Desain Utama",
  width: 1280,
  height: 720,
  minHeight: 720,
  background: "#ffffff"
};

export const INITIAL_ELEMENTS: CanvasElement[] = [
  {
    id: "flexbox-default",
    name: "main",
    type: "frame",
    isDefault: true,
    x: 0,
    y: 0,
    width: 1280,
    height: 520,
    fill: "#ffffff",
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "solid",
    opacity: 100,
    boxShadow: "none",
    isAutoLayout: true,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40
  }
];

function makeRoot(
  id: string,
  name: string,
  type: ElementType,
  x: number,
  y: number,
  width: number,
  height: number,
  overrides: Partial<CanvasElement> = {}
): CanvasElement {
  return {
    id,
    name,
    type,
    x,
    y,
    width,
    height,
    rotation: 0,
    fill: "transparent",
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "transparent",
    borderStyle: "none",
    opacity: 100,
    boxShadow: "none",
    ...overrides
  };
}

export function cloneCanvasElement(target: CanvasElement): CanvasElement {
  return {
    ...JSON.parse(JSON.stringify(target)),
    id: `el-${Date.now()}`,
    name: `${target.name} (Salinan)`,
    x: target.x + 20,
    y: target.y + 20,
    isDefault: false
  };
}

export function createRootCanvasElement(
  type: ElementType,
  count: number,
  x = 80,
  y = 80
): CanvasElement {
  const id = `el-${Date.now()}`;

  switch (type) {
    case "heading":
      return makeRoot(id, `Judul ${count}`, "heading", x, y, 400, 60, {
        content: "Judul Baru",
        color: "#0f172a",
        fontSize: 32,
        fontWeight: "700",
        fontFamily: "Poppins",
        textAlign: "left"
      });
    case "text":
      return makeRoot(id, `Teks ${count}`, "text", x, y, 320, 60, {
        content: "Tulis penjelasan konten atau paragraf informasi di sini.",
        color: "#475569",
        fontSize: 16,
        fontWeight: "400",
        fontFamily: "Poppins",
        textAlign: "left"
      });
    case "button":
      return makeRoot(id, `Tombol ${count}`, "button", x, y, 160, 44, {
        content: "Klik Di Sini",
        fill: "#0d99ff",
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "Poppins",
        textAlign: "center",
        borderRadius: 8,
        padding: 12,
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
        paddingLeft: 20
      });
    case "badge":
      return makeRoot(id, `Tag / Badge ${count}`, "badge", x, y, 140, 32, {
        content: "LABEL BARU",
        fill: "#1e293b",
        color: "#38bdf8",
        fontSize: 12,
        fontWeight: "600",
        fontFamily: "Poppins",
        textAlign: "center",
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#0284c7",
        borderStyle: "solid"
      });
    case "image":
      return makeRoot(id, `Gambar ${count}`, "image", x, y, 280, 200, {
        src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
        fill: "#1e293b",
        borderRadius: 12
      });
    case "link":
      return makeRoot(id, `Tautan ${count}`, "link", x, y, 180, 36, {
        content: "Tautan Menuju Halaman →",
        href: "https://example.com",
        color: "#0d99ff",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "Poppins",
        textAlign: "left"
      });
    case "icon":
      return makeRoot(id, `Ikon ${count}`, "icon", x, y, 48, 48, {
        icon: "lucide:smile",
        color: "#0d99ff"
      });
    case "youtube":
      return makeRoot(id, `Iframe YouTube ${count}`, "youtube", x, y, 480, 270, {
        src: DEFAULT_YOUTUBE_URL,
        fill: "#0f172a",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
        borderStyle: "solid"
      });
    case "frame":
      return makeRoot(id, `Flexbox ${count}`, "frame", x, y, 320, 80, {
        widthMode: "fixed",
        heightMode: "fixed",
        isAutoLayout: true,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 0,
        padding: 0
      });
    case "rectangle":
    default:
      return makeRoot(id, `Kontainer / Kartu ${count}`, "rectangle", x, y, 300, 180, {
        fill: "#1e293b",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
        borderStyle: "solid"
      });
  }
}
