import type { CanvasElement, CanvasFrame } from "./types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getStyleString(el: CanvasElement): string {
  const styles: string[] = [];

  if (el.fill && el.fill !== "transparent") {
    styles.push(`background-color: ${el.fill}`);
  }
  if (el.color) styles.push(`color: ${el.color}`);
  if (el.fontSize) styles.push(`font-size: ${el.fontSize}px`);
  if (el.fontWeight) styles.push(`font-weight: ${el.fontWeight}`);
  if (el.fontFamily) styles.push(`font-family: ${el.fontFamily}`);
  if (el.textAlign) styles.push(`text-align: ${el.textAlign}`);

  if (el.borderRadius) styles.push(`border-radius: ${el.borderRadius}px`);
  if (el.borderWidth && el.borderStyle !== "none") {
    styles.push(`border: ${el.borderWidth}px ${el.borderStyle} ${el.borderColor || "transparent"}`);
  }

  if (el.opacity !== undefined && el.opacity < 100) {
    styles.push(`opacity: ${el.opacity / 100}`);
  }

  // Padding
  const pt = el.paddingTop ?? el.padding ?? 0;
  const pr = el.paddingRight ?? el.padding ?? 0;
  const pb = el.paddingBottom ?? el.padding ?? 0;
  const pl = el.paddingLeft ?? el.padding ?? 0;
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
    if (el.justifyContent) styles.push(`justify-content: ${el.justifyContent}`);
    if (el.alignItems) styles.push(`align-items: ${el.alignItems}`);
    const gap = el.gap ?? 0;
    if (gap) styles.push(`gap: ${gap}px`);
  }

  return styles.join("; ");
}

function renderElement(el: CanvasElement, allElements: CanvasElement[]): string {
  if (el.hidden) return "";

  const style = getStyleString(el);
  const styleAttr = style ? ` style="${escapeHtml(style)}"` : "";
  const children = allElements.filter((child) => child.parentId === el.id);
  const innerChildrenHtml = children.map((c) => renderElement(c, allElements)).join("\n");

  switch (el.type) {
    case "heading":
      return `<h2${styleAttr}>${escapeHtml(el.content || "")}</h2>`;
    case "text":
      return `<p${styleAttr}>${escapeHtml(el.content || "")}</p>`;
    case "button":
      return `<a href="${escapeHtml(el.href || "#")}"${styleAttr} style="display: inline-flex; align-items: center; justify-content: center; text-decoration: none; ${style}">${escapeHtml(el.content || "Button")}</a>`;
    case "link":
      return `<a href="${escapeHtml(el.href || "#")}"${styleAttr}>${escapeHtml(el.content || "Link")}</a>`;
    case "badge":
      return `<span${styleAttr} style="display: inline-block; ${style}">${escapeHtml(el.content || "")}</span>`;
    case "image":
      return `<img src="${escapeHtml(el.src || "")}" alt="${escapeHtml(el.alt || el.name || "")}"${styleAttr} style="max-width: 100%; height: auto; ${style}" />`;
    case "youtube":
      return `<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: ${el.borderRadius || 0}px;"><iframe src="${escapeHtml(el.src || "https://www.youtube.com/embed/dQw4w9WgXcQ")}" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe></div>`;
    case "frame":
    case "rectangle":
    default:
      return `<div${styleAttr}>\n${innerChildrenHtml}\n</div>`;
  }
}

export function generateHtmlFromElements(elements: CanvasElement[], frame?: CanvasFrame): string {
  const rootElements = elements.filter((el) => !el.parentId);
  const bodyHtml = rootElements.map((el) => renderElement(el, elements)).join("\n");

  const bgStyle = frame?.background ? `background-color: ${frame.background};` : "";
  return `<div class="nawra-canvas-rendered" style="width: 100%; ${bgStyle}">\n${bodyHtml}\n</div>`;
}
