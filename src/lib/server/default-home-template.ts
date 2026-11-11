import { generateHtmlFromElements } from "#lib/components/editor/html-generator";

import type { CanvasElement, CanvasFrame } from "#lib/components/editor/types";
import type { DefaultTemplateResult } from "./default-templates";

export function getDefaultHomeTemplate(): DefaultTemplateResult {
  const title = "Beranda Utama";
  const elements: CanvasElement[] = [
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
      padding: 60
    },
    {
      id: "hero-badge",
      name: "Hero Badge",
      type: "text",
      parentId: "flexbox-default",
      content: "No-Code Visual CMS Studio",
      color: "#0d99ff",
      fontSize: 13,
      fontWeight: "600",
      fill: "transparent",
      borderRadius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      borderStyle: "none",
      opacity: 100,
      boxShadow: "none",
      x: 0,
      y: 0,
      width: 250,
      height: 24
    },
    {
      id: "hero-title",
      name: "Hero Title",
      type: "heading",
      parentId: "flexbox-default",
      content: "Bangun Website Impian Anda Tanpa Koding",
      color: "#111827",
      fontSize: 36,
      fontWeight: "800",
      fill: "transparent",
      borderRadius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      borderStyle: "none",
      opacity: 100,
      boxShadow: "none",
      x: 0,
      y: 0,
      width: 800,
      height: 60
    },
    {
      id: "hero-desc",
      name: "Hero Description",
      type: "text",
      parentId: "flexbox-default",
      content:
        "Kelola konten, rancang tata letak header, footer, dan landing page secara langsung melalui visual kanvas studio yang cepat dan responsif.",
      color: "#4b5563",
      fontSize: 15,
      fontWeight: "400",
      fill: "transparent",
      borderRadius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      borderStyle: "none",
      opacity: 100,
      boxShadow: "none",
      x: 0,
      y: 0,
      width: 720,
      height: 48
    },
    {
      id: "hero-cta",
      name: "Hero CTA Button",
      type: "button",
      parentId: "flexbox-default",
      content: "Mulai Mendesain",
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "600",
      fill: "#0d99ff",
      borderRadius: 8,
      borderWidth: 0,
      borderColor: "transparent",
      borderStyle: "none",
      opacity: 100,
      boxShadow: "none",
      x: 0,
      y: 0,
      width: 170,
      height: 44
    }
  ];
  const frame: CanvasFrame = { name: title, width: 1280, height: 520, background: "#ffffff" };
  const contentJson = JSON.stringify({ elements, frame });
  const contentHtml = generateHtmlFromElements(elements, frame, "homepage");

  return { title, contentJson, contentHtml };
}
