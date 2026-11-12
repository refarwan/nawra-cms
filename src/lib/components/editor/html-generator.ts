import { toYouTubeEmbedUrl } from "./youtube-utils";

import type { CanvasElement, CanvasFrame, EditorTargetType } from "./types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRootSemanticTag(
  el: CanvasElement,
  targetType?: EditorTargetType | null
): "header" | "footer" | "main" | "div" {
  const isRootDefault =
    !el.parentId &&
    (el.isDefault ||
      el.id === "flexbox-default" ||
      el.name === "header" ||
      el.name === "footer" ||
      el.name === "main");

  if (!isRootDefault) return "div";
  const lowerName = (el.name || "").toLowerCase();
  if (targetType === "header" || lowerName === "header") return "header";
  if (targetType === "footer" || lowerName === "footer") return "footer";
  return "main";
}

function getStyleString(
  el: CanvasElement,
  targetType?: EditorTargetType | null,
  frame?: CanvasFrame
): string {
  const styles: string[] = ["box-sizing: border-box"];
  const semanticTag = getRootSemanticTag(el, targetType);
  const isDefaultFrame = semanticTag !== "div";
  const widthMode = isDefaultFrame ? "fill" : el.widthMode || "fixed";
  const heightMode = el.heightMode || "fixed";

  const pt = el.paddingTop ?? el.padding ?? 0;
  const pr = el.paddingRight ?? el.padding ?? 0;
  const pb = el.paddingBottom ?? el.padding ?? 0;
  const pl = el.paddingLeft ?? el.padding ?? 0;

  // Width
  if (widthMode === "fill") {
    styles.push("width: 100%");
  } else if (widthMode === "hug" && el.type !== "youtube") {
    styles.push("width: fit-content");
    styles.push("max-width: 100%");
  } else if (el.width) {
    styles.push(`width: ${el.width + pl + pr}px`);
    styles.push("max-width: 100%");
  }

  if (semanticTag === "main") {
    styles.push("flex: 1 1 auto");
  }

  // Height
  if (heightMode === "fixed" && el.height) {
    const totalHeight = el.height + pt + pb;
    const totalWidth = (el.width || 0) + pl + pr;
    if ((el.type === "image" || el.type === "youtube") && widthMode === "fixed" && totalWidth > 0) {
      styles.push(`aspect-ratio: ${totalWidth} / ${totalHeight}`);
      styles.push("height: auto");
    } else if (el.type === "image" || el.type === "icon" || el.type === "youtube") {
      styles.push(`height: ${totalHeight}px`);
    } else {
      styles.push(`min-height: ${totalHeight}px`);
    }
  } else if (heightMode === "fill") {
    styles.push("height: 100%");
    styles.push("align-self: stretch");
  } else if (el.type === "youtube" && el.height) {
    styles.push(`height: ${el.height + pt + pb}px`);
  }

  const bgColor =
    el.fill && el.fill !== "transparent" ? el.fill : isDefaultFrame ? frame?.background : undefined;
  if (bgColor && bgColor !== "transparent") {
    styles.push(`background-color: ${bgColor}`);
  }
  if (el.color) styles.push(`color: ${el.color}`);
  if (el.fontSize) styles.push(`font-size: ${el.fontSize}px`);
  if (el.fontWeight) styles.push(`font-weight: ${el.fontWeight}`);
  if (el.fontFamily) {
    styles.push(`font-family: ${el.fontFamily === "Inter" ? "Poppins" : el.fontFamily}`);
  }
  if (el.textAlign) styles.push(`text-align: ${el.textAlign}`);

  if (el.borderRadius) styles.push(`border-radius: ${el.borderRadius}px`);
  if (el.borderWidth && el.borderStyle !== "none") {
    styles.push(`border: ${el.borderWidth}px ${el.borderStyle} ${el.borderColor || "transparent"}`);
  }

  if (el.opacity !== undefined && el.opacity < 100) {
    styles.push(`opacity: ${el.opacity / 100}`);
  }

  // Padding
  if (pt || pr || pb || pl) {
    styles.push(`padding: ${pt}px ${pr}px ${pb}px ${pl}px`);
  }

  // Margin
  const mt = el.marginTop ?? el.margin ?? 0;
  const mr = el.marginRight ?? el.margin ?? 0;
  const mb = el.marginBottom ?? el.margin ?? 0;
  const ml = el.marginLeft ?? el.margin ?? 0;
  if (mt || mr || mb || ml) {
    styles.push(`margin: ${mt}px ${mr}px ${mb}px ${ml}px`);
  }

  // Layout / Flexbox
  if (el.type === "frame" || el.isAutoLayout) {
    styles.push("display: flex");
    styles.push(`flex-direction: ${el.flexDirection || "row"}`);
    styles.push("flex-wrap: wrap");
    if (el.justifyContent) styles.push(`justify-content: ${el.justifyContent}`);
    if (el.alignItems) styles.push(`align-items: ${el.alignItems}`);
    const rowGap = el.gapY ?? el.gap ?? 0;
    const colGap = el.gapX ?? el.gap ?? 0;
    if (rowGap || colGap) styles.push(`gap: ${rowGap}px ${colGap}px`);
  } else if (
    el.type === "heading" ||
    el.type === "text" ||
    el.type === "button" ||
    el.type === "link" ||
    el.type === "badge"
  ) {
    styles.push("display: inline-flex");
    styles.push("align-items: center");
    const align = el.textAlign || (el.type === "button" || el.type === "badge" ? "center" : "left");
    styles.push(
      `justify-content: ${align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start"}`
    );
  }

  return styles.join("; ");
}

function renderElement(
  el: CanvasElement,
  allElements: CanvasElement[],
  targetType?: EditorTargetType | null,
  frame?: CanvasFrame
): string {
  if (el.hidden) return "";

  const style = getStyleString(el, targetType, frame);
  const styleAttr = style ? ` style="${escapeHtml(style)}"` : "";
  const children = allElements.filter((child) => child.parentId === el.id);
  const innerChildrenHtml = children
    .map((c) => renderElement(c, allElements, targetType, frame))
    .join("\n");

  switch (el.type) {
    case "heading":
      return `<h2${styleAttr}>${escapeHtml(el.content || "")}</h2>`;
    case "text":
      return `<p${styleAttr}>${escapeHtml(el.content || "")}</p>`;
    case "button":
      return `<a href="${escapeHtml(el.href || "#")}" style="text-decoration: none; ${escapeHtml(style)}">${escapeHtml(el.content || "Button")}</a>`;
    case "link":
      return `<a href="${escapeHtml(el.href || "#")}" style="text-decoration: none; ${escapeHtml(style)}">${escapeHtml(el.content || "Link")}</a>`;
    case "badge":
      return `<span${styleAttr}>${escapeHtml(el.content || "")}</span>`;
    case "image":
      return `<img src="${escapeHtml(el.src || "")}" alt="${escapeHtml(el.alt || el.name || "")}" style="object-fit: cover; ${escapeHtml(style)}" />`;
    case "youtube":
      return `<div style="overflow: hidden; ${escapeHtml(style)}"><iframe src="${escapeHtml(toYouTubeEmbedUrl(el.src))}" title="${escapeHtml(el.name || "YouTube Video")}" style="width: 100%; height: 100%; border: 0; display: block;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    case "frame":
    case "rectangle":
    default: {
      const tag = getRootSemanticTag(el, targetType);
      return `<${tag}${styleAttr}>\n${innerChildrenHtml}\n</${tag}>`;
    }
  }
}

export function generateHtmlFromElements(
  elements: CanvasElement[],
  frame?: CanvasFrame,
  targetType?: EditorTargetType | null
): string {
  const rootElements = elements.filter((el) => !el.parentId);
  return rootElements.map((el) => renderElement(el, elements, targetType, frame)).join("\n");
}
