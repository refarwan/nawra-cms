import { computeResizedElementUpdates, getElTotalHeight } from "./canvas-gesture";

import type { EditorState } from "./editor-state.svelte";
import type { CanvasElement } from "./types";

export function applyDragMove(
  editor: EditorState,
  elementStartPos: { x: number; y: number },
  dragStartPos: { x: number; y: number },
  clientX: number,
  clientY: number
) {
  if (!editor.selectedElement) return;
  const dx = (clientX - dragStartPos.x) / editor.zoom;
  const dy = (clientY - dragStartPos.y) / editor.zoom;
  editor.updateElement(editor.selectedElement.id, {
    x: Math.round(elementStartPos.x + dx),
    y: Math.round(elementStartPos.y + dy)
  });
}

export function applyResizeMove(
  editor: EditorState,
  resizeHandle: string,
  initialBox: { x: number; y: number; w: number; h: number },
  dragStartPos: { x: number; y: number },
  e: MouseEvent,
  activePresetMinHeight: number
) {
  if (!editor.selectedElement) return;
  const isDef = editor.selectedElement.isDefault || editor.selectedElement.id === "flexbox-default";
  const dx = (e.clientX - dragStartPos.x) / editor.zoom;
  const dy = (e.clientY - dragStartPos.y) / editor.zoom;
  if (isDef) {
    editor.frame.minHeight = Math.max(activePresetMinHeight, Math.round(initialBox.h + dy));
    return;
  }
  editor.updateElement(
    editor.selectedElement.id,
    computeResizedElementUpdates(resizeHandle, initialBox, dx, dy)
  );
}

export function computePresetMinHeight(
  editor: EditorState,
  defaultFrameEl?: CanvasElement
): number {
  if (defaultFrameEl) {
    if ((defaultFrameEl.heightMode || "fixed") === "fixed" && defaultFrameEl.height) {
      return getElTotalHeight(defaultFrameEl);
    }
    if (defaultFrameEl.heightMode === "hug") return 40;
  }
  if (editor.frame.minHeight) return editor.frame.minHeight;
  if (editor.targetType === "header" || editor.targetType === "footer") {
    return editor.frame.height || 80;
  }
  if (editor.device === "mobile" || editor.frame.width <= 480) return 780;
  if (editor.device === "tablet" || editor.frame.width <= 820) return 900;
  return 720;
}

export function computeMaxFreeBottom(elements: CanvasElement[]): number {
  const freeEls = elements.filter(
    (el) => !el.parentId && !el.isDefault && el.id !== "flexbox-default" && !el.hidden
  );
  return freeEls.length === 0
    ? 0
    : Math.max(...freeEls.map((el) => (el.y || 0) + (el.height || 0)));
}

export function handleCanvasShortcuts(
  e: KeyboardEvent,
  editor: EditorState,
  setSpacePressed: (val: boolean) => void
) {
  const isEditingText =
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLTextAreaElement ||
    (e.target instanceof HTMLElement && e.target.isContentEditable);
  if (e.code === "Space" && !isEditingText) {
    setSpacePressed(true);
  }
  if (isEditingText) return;

  if (!e.metaKey && !e.ctrlKey && !e.altKey) {
    if (e.key === "v" || e.key === "V") editor.tool = "select";
    else if (e.key === "h" || e.key === "H") editor.tool = "pan";
  }

  if (editor.selectedElement) {
    const isDef =
      editor.selectedElement.isDefault || editor.selectedElement.id === "flexbox-default";
    if ((e.key === "Delete" || e.key === "Backspace") && !isDef) {
      e.preventDefault();
      editor.deleteElement(editor.selectedElement.id);
    } else if ((e.metaKey || e.ctrlKey) && e.key === "d") {
      e.preventDefault();
      editor.duplicateElement(editor.selectedElement.id);
    } else if (e.key.startsWith("Arrow") && !isDef) {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      let { x, y } = editor.selectedElement;
      if (e.key === "ArrowUp") y -= step;
      if (e.key === "ArrowDown") y += step;
      if (e.key === "ArrowLeft") x -= step;
      if (e.key === "ArrowRight") x += step;
      editor.updateElement(editor.selectedElement.id, { x, y });
      editor.commitUpdate();
    }
  }

  if ((e.metaKey || e.ctrlKey) && e.key === "z") {
    e.preventDefault();
    if (e.shiftKey) editor.redo();
    else editor.undo();
  }
}

export function handlePendingElementInsert(
  e: MouseEvent,
  editor: EditorState,
  targetEl?: CanvasElement
): boolean {
  if (!editor.pendingElementType) return false;

  if (targetEl) {
    e.stopPropagation();
    const targetFrameId = targetEl.type === "frame" ? targetEl.id : targetEl.parentId;
    if (targetFrameId) {
      editor.addElementToFrame(targetFrameId, editor.pendingElementType, {
        flexDirection: editor.pendingFrameDirection
      });
    } else {
      editor.addElement(editor.pendingElementType, targetEl.x + 20, targetEl.y + 20);
    }
    editor.pendingElementType = null;
    return true;
  }

  const target = e.target as HTMLElement;
  const artboardEl = (
    target.dataset.role === "artboard" ? target : target.closest('[data-role="artboard"]')
  ) as HTMLElement | null;
  if (artboardEl) {
    const rect = artboardEl.getBoundingClientRect();
    const clickX = Math.round((e.clientX - rect.left) / editor.zoom);
    const clickY = Math.round((e.clientY - rect.top) / editor.zoom);
    editor.addElement(editor.pendingElementType, Math.max(0, clickX), Math.max(0, clickY));
    editor.pendingElementType = null;
    return true;
  }
  return false;
}
