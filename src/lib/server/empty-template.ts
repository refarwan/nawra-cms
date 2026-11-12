import { generateHtmlFromElements } from "#lib/components/editor/html-generator";

import { elFrame } from "./template-element-builders";

import type { CanvasElement, CanvasFrame } from "#lib/components/editor/types";
import type { DefaultTemplateResult } from "./default-templates";

export function getEmptySectionTemplate(
  type: "header" | "footer" | "homepage" | "page" | "article",
  title: string
): DefaultTemplateResult {
  const fallbackTitle: Record<typeof type, string> = {
    header: "Header Baru",
    footer: "Footer Baru",
    homepage: "Beranda Baru",
    page: "Halaman Baru",
    article: "Artikel Baru"
  };
  const safeTitle = title.trim() || fallbackTitle[type];

  const height = type === "header" ? 76 : type === "footer" ? 160 : 760;
  const rootName = type === "header" ? "header" : type === "footer" ? "footer" : "main";

  const rootProps: Partial<CanvasElement> =
    type === "header"
      ? {
          isDefault: true,
          width: 1280,
          height,
          fill: "#ffffff",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 48,
          paddingRight: 48
        }
      : type === "footer"
        ? {
            isDefault: true,
            width: 1280,
            height,
            fill: "#ffffff",
            gap: 24,
            paddingTop: 32,
            paddingBottom: 32,
            paddingLeft: 48,
            paddingRight: 48
          }
        : {
            isDefault: true,
            width: 1280,
            height,
            fill: "#ffffff",
            justifyContent: "flex-start"
          };

  const elements: CanvasElement[] = [elFrame("flexbox-default", rootName, undefined, rootProps)];
  const frame: CanvasFrame = { name: safeTitle, width: 1280, height, background: "#ffffff" };

  return {
    title: safeTitle,
    contentJson: JSON.stringify({ elements, frame }),
    contentHtml: generateHtmlFromElements(elements, frame, type)
  };
}
