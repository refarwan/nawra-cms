import { DEFAULT_YOUTUBE_URL } from "./youtube-utils";

import type { CanvasElement, ElementType } from "./types";

function makeBase(
  id: string,
  frameId: string,
  name: string,
  type: ElementType,
  width: number,
  height: number,
  overrides: Partial<CanvasElement> = {}
): CanvasElement {
  return {
    id,
    parentId: frameId,
    name,
    type,
    x: 0,
    y: 0,
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

export function buildChildForFrame(
  elements: CanvasElement[],
  frameId: string,
  type: ElementType,
  flexDirection: "row" | "column" = "row"
): CanvasElement | null {
  const parent = elements.find((el) => el.id === frameId);
  if (!parent || parent.type !== "frame") return null;
  const count = elements.filter((el) => el.parentId === frameId).length + 1;
  const padX =
    (parent.paddingLeft ?? parent.padding ?? 0) + (parent.paddingRight ?? parent.padding ?? 0);
  const maxW = Math.max(120, (parent.width || 320) - padX);
  return createFrameChildElement(frameId, type, count, maxW, flexDirection);
}

export function createFrameChildElement(
  frameId: string,
  type: ElementType,
  count: number,
  maxInnerWidth: number,
  flexDirection: "row" | "column" = "row"
): CanvasElement {
  const id = `el-${Date.now()}`;

  switch (type) {
    case "heading":
      return makeBase(id, frameId, `Judul ${count}`, "heading", Math.min(maxInnerWidth, 260), 48, {
        widthMode: "hug",
        heightMode: "hug",
        content: "Judul Konten",
        color: "#0f172a",
        fontSize: 24,
        fontWeight: "700",
        fontFamily: "Poppins",
        textAlign: "left"
      });
    case "text":
      return makeBase(id, frameId, `Paragraf ${count}`, "text", Math.min(maxInnerWidth, 260), 60, {
        widthMode: "fixed",
        heightMode: "hug",
        content: "Tulis penjelasan konten atau paragraf informasi di sini.",
        color: "#475569",
        fontSize: 14,
        fontWeight: "400",
        fontFamily: "Poppins",
        textAlign: "left"
      });
    case "button":
      return makeBase(id, frameId, `Tombol ${count}`, "button", Math.min(maxInnerWidth, 140), 42, {
        widthMode: "hug",
        heightMode: "hug",
        content: "Tombol Aksi",
        href: "#",
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
    case "link":
      return makeBase(id, frameId, `Tautan ${count}`, "link", Math.min(maxInnerWidth, 150), 32, {
        widthMode: "hug",
        heightMode: "hug",
        content: "Tautan Halaman →",
        href: "https://example.com",
        color: "#0d99ff",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "Poppins",
        textAlign: "left"
      });
    case "image": {
      const w = Math.min(maxInnerWidth, 280);
      return makeBase(
        id,
        frameId,
        `Gambar ${count}`,
        "image",
        w,
        Math.min(180, Math.round(w * 0.65)),
        {
          widthMode: "fixed",
          heightMode: "fixed",
          src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
          borderRadius: 8
        }
      );
    }
    case "frame":
      return makeBase(
        id,
        frameId,
        `Flexbox ${flexDirection === "row" ? "Baris" : "Kolom"} ${count}`,
        "frame",
        320,
        80,
        {
          widthMode: "fixed",
          heightMode: "fixed",
          isAutoLayout: true,
          flexDirection,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 0,
          gapX: 0,
          gapY: 0,
          padding: 0
        }
      );
    case "icon": {
      const s = Math.min(maxInnerWidth, 48);
      return makeBase(id, frameId, `Ikon ${count}`, "icon", s, s, {
        widthMode: "fixed",
        heightMode: "fixed",
        icon: "lucide:smile",
        color: "#0d99ff"
      });
    }
    case "youtube": {
      const w = Math.min(maxInnerWidth, 380);
      return makeBase(
        id,
        frameId,
        `Iframe YouTube ${count}`,
        "youtube",
        w,
        Math.min(220, Math.round(w * 0.58)),
        {
          widthMode: "fixed",
          heightMode: "fixed",
          src: DEFAULT_YOUTUBE_URL,
          fill: "#0f172a",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#334155",
          borderStyle: "solid"
        }
      );
    }
    default:
      return makeBase(id, frameId, `Elemen ${count}`, type, 180, 60, {
        content: "Konten Baru",
        fill: "#1e293b",
        borderRadius: 8
      });
  }
}
