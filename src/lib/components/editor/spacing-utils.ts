import type { CanvasElement } from "./types";

export function getPaddingCss(el: CanvasElement): string {
  const top = el.paddingTop ?? el.padding ?? 0;
  const right = el.paddingRight ?? el.padding ?? 0;
  const bottom = el.paddingBottom ?? el.padding ?? 0;
  const left = el.paddingLeft ?? el.padding ?? 0;

  if (el.type !== "frame" && !top && !right && !bottom && !left) {
    return "";
  }
  return `padding: ${top}px ${right}px ${bottom}px ${left}px;`;
}

export function getMarginCss(el: CanvasElement): string {
  const top = el.marginTop ?? el.margin ?? 0;
  const right = el.marginRight ?? el.margin ?? 0;
  const bottom = el.marginBottom ?? el.margin ?? 0;
  const left = el.marginLeft ?? el.margin ?? 0;

  if (!top && !right && !bottom && !left) {
    return "";
  }
  return `margin: ${top}px ${right}px ${bottom}px ${left}px;`;
}

export function getGapCss(el: CanvasElement): string {
  const row = el.gapY ?? el.gap ?? 0;
  const col = el.gapX ?? el.gap ?? 0;
  return `gap: ${row}px ${col}px;`;
}
