import { computeMaxFreeBottom, computePresetMinHeight } from "./canvas-interactions";

import type { EditorState } from "./editor-state.svelte";
import type { CanvasElement } from "./types";

export function getCanvasFrameMetrics(editor: EditorState, defaultFrameHeight: number) {
  const defaultFrameEl =
    editor.resolvedElements.find((el) => el.isDefault || el.id === "flexbox-default") ||
    editor.resolvedElements.find((el) => !el.parentId && el.type === "frame");
  const activePresetMinHeight = computePresetMinHeight(editor, defaultFrameEl);
  const autoCanvasHeight = Math.max(
    activePresetMinHeight,
    defaultFrameHeight,
    computeMaxFreeBottom(editor.resolvedElements)
  );
  return { defaultFrameEl, activePresetMinHeight, autoCanvasHeight };
}

export function getRootFrameTag(
  el: CanvasElement,
  isDefaultFrame: boolean,
  targetType?: string | null
): "header" | "footer" | "main" | "div" {
  if (!isDefaultFrame) return "div";
  if (targetType === "header" || el.name === "header") return "header";
  if (targetType === "footer" || el.name === "footer") return "footer";
  return "main";
}

export function getRootSizeLabels(
  el: CanvasElement,
  isDefaultFrame: boolean,
  frameWidth: number,
  widthMode: string,
  heightMode: string
) {
  const wText = isDefaultFrame
    ? `${frameWidth}px`
    : widthMode === "fill"
      ? "Penuh"
      : widthMode === "hug"
        ? "Ikuti"
        : `${el.width}px`;
  const hText = heightMode === "fill" ? "Penuh" : heightMode === "hug" ? "Ikuti" : `${el.height}px`;
  return { wText, hText };
}

export function getCanvasItemCursor(
  el: CanvasElement,
  isSelected: boolean,
  isPreviewMode: boolean,
  isPanActive: boolean,
  isCanvasPanning: boolean,
  isDefaultFrame = false,
  fallbackCursor = "pointer"
): string {
  if (isCanvasPanning) return "grabbing";
  if (isPanActive) return "grab";
  if (isPreviewMode || isDefaultFrame) return "default";
  if (el.locked) return "not-allowed";
  if ((el.type === "heading" || el.type === "text") && isSelected) return "text";
  return fallbackCursor;
}

export function isEditableTextElement(el: CanvasElement, isPreviewMode: boolean): boolean {
  return (
    !isPreviewMode &&
    !el.locked &&
    (el.type === "heading" ||
      el.type === "text" ||
      el.type === "button" ||
      el.type === "badge" ||
      el.type === "link")
  );
}

export function placeCaretAtPoint(node: HTMLElement, x?: number, y?: number) {
  const sel = window.getSelection();
  if (!sel) return;
  let range: Range | null = null;
  if (x !== undefined && y !== undefined) {
    const doc = document as Document & {
      caretPositionFromPoint?: (
        px: number,
        py: number
      ) => { offsetNode: Node; offset: number } | null;
      caretRangeFromPoint?: (px: number, py: number) => Range | null;
    };
    if (doc.caretPositionFromPoint) {
      const pos = doc.caretPositionFromPoint(x, y);
      if (pos && node.contains(pos.offsetNode)) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    } else if (doc.caretRangeFromPoint) {
      const r = doc.caretRangeFromPoint(x, y);
      if (r && node.contains(r.startContainer)) {
        range = r;
        range.collapse(true);
      }
    }
  }
  sel.removeAllRanges();
  if (range) {
    sel.addRange(range);
  } else {
    const fallback = document.createRange();
    fallback.selectNodeContents(node);
    fallback.collapse(false);
    sel.addRange(fallback);
  }
}
