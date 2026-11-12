import { cloneCanvasElement, createRootCanvasElement } from "./canvas-element-factory";
import { buildChildForFrame } from "./frame-element-factory";
import { collectDeleteIds } from "./layer-utils";

import type { CanvasElement, ElementType } from "./types";

export function addCanvasChildToFrame(
  elements: CanvasElement[],
  frameId: string,
  type: ElementType,
  direction: "row" | "column"
): { updatedElements: CanvasElement[]; newId: string } | null {
  const newEl = buildChildForFrame(elements, frameId, type, direction);
  if (!newEl) return null;
  return {
    updatedElements: [...elements, newEl],
    newId: newEl.id
  };
}

export function createAndAddRootElement(
  elements: CanvasElement[],
  type: ElementType,
  x = 80,
  y = 80
): { updatedElements: CanvasElement[]; newId: string } {
  const newEl = createRootCanvasElement(type, elements.length + 1, x, y);
  return {
    updatedElements: [...elements, newEl],
    newId: newEl.id
  };
}

export function duplicateCanvasElement(
  elements: CanvasElement[],
  id: string
): { updatedElements: CanvasElement[]; clonedId: string } | null {
  const target = elements.find((el) => el.id === id);
  if (!target || target.isDefault || id === "flexbox-default") return null;
  const clone = cloneCanvasElement(target);
  return {
    updatedElements: [...elements, clone],
    clonedId: clone.id
  };
}

export function deleteCanvasElement(
  elements: CanvasElement[],
  id: string,
  selectedId: string | null
): { updatedElements: CanvasElement[]; nextSelectedId: string | null } | null {
  const target = elements.find((el) => el.id === id);
  if (target?.isDefault || id === "flexbox-default") return null;
  const ids = collectDeleteIds(elements, id);
  return {
    updatedElements: elements.filter((el) => !ids.includes(el.id)),
    nextSelectedId: selectedId && ids.includes(selectedId) ? null : selectedId
  };
}

export function toggleElementVisibility(elements: CanvasElement[], id: string): boolean {
  const el = elements.find((e) => e.id === id);
  if (!el) return false;
  el.hidden = !el.hidden;
  return true;
}

export function toggleElementLock(elements: CanvasElement[], id: string): boolean {
  const el = elements.find((e) => e.id === id);
  if (!el) return false;
  el.locked = !el.locked;
  return true;
}
