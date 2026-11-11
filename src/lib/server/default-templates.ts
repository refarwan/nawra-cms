import { generateHtmlFromElements } from "#lib/components/editor/html-generator";

import type { CanvasElement, CanvasFrame } from "#lib/components/editor/types";

export interface DefaultTemplateResult {
  title: string;
  contentJson: string;
  contentHtml: string;
}

export function getDefaultHeaderTemplate(): DefaultTemplateResult {
  const title = "Header Utama";
  const elements: CanvasElement[] = [
    {
      id: "nav-wrapper",
      name: "Nav Wrapper",
      type: "frame",
      x: 0,
      y: 0,
      width: 1280,
      height: 70,
      fill: "#ffffff",
      borderRadius: 0,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderStyle: "solid",
      opacity: 100,
      boxShadow: "none",
      isAutoLayout: true,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20
    },
    {
      id: "logo-text",
      name: "Logo Text",
      type: "heading",
      parentId: "nav-wrapper",
      content: "Nawra CMS",
      color: "#111827",
      fontSize: 18,
      fontWeight: "700",
      fill: "transparent",
      borderRadius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      borderStyle: "none",
      opacity: 100,
      boxShadow: "none",
      x: 0,
      y: 0,
      width: 200,
      height: 30
    }
  ];
  const frame: CanvasFrame = { name: title, width: 1280, height: 70, background: "#ffffff" };
  const contentJson = JSON.stringify({ elements, frame });
  const contentHtml = generateHtmlFromElements(elements, frame);

  return { title, contentJson, contentHtml };
}

export function getDefaultFooterTemplate(): DefaultTemplateResult {
  const title = "Footer Utama";
  const elements: CanvasElement[] = [
    {
      id: "footer-wrapper",
      name: "Footer Wrapper",
      type: "frame",
      x: 0,
      y: 0,
      width: 1280,
      height: 80,
      fill: "#ffffff",
      borderRadius: 0,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderStyle: "solid",
      opacity: 100,
      boxShadow: "none",
      isAutoLayout: true,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 24
    },
    {
      id: "copyright-text",
      name: "Copyright Text",
      type: "text",
      parentId: "footer-wrapper",
      content: `© ${new Date().getFullYear()} Nawra CMS. Hak cipta dilindungi.`,
      color: "#6b7280",
      fontSize: 13,
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
      width: 400,
      height: 24
    }
  ];
  const frame: CanvasFrame = { name: title, width: 1280, height: 80, background: "#ffffff" };
  const contentJson = JSON.stringify({ elements, frame });
  const contentHtml = generateHtmlFromElements(elements, frame);

  return { title, contentJson, contentHtml };
}
