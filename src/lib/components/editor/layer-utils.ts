import type { CanvasElement, CanvasFrame, DeviceMode, EditorTargetType } from "./types";

export function applyDeviceDimensions(
  frame: CanvasFrame,
  elements: CanvasElement[],
  device: DeviceMode
): number {
  const map = {
    mobile: { w: 390, h: 780, z: 0.9 },
    tablet: { w: 768, h: 900, z: 0.85 },
    desktop: { w: 1280, h: 720, z: 1 }
  }[device];
  frame.width = map.w;
  frame.minHeight = map.h;
  const defaultFb = elements.find((el) => el.isDefault || el.id === "flexbox-default");
  if (defaultFb) {
    defaultFb.x = 0;
    defaultFb.y = 0;
    defaultFb.width = frame.width;
  }
  return map.z;
}

export function collectDeleteIds(elements: CanvasElement[], rootId: string): string[] {
  const idsToDelete = [rootId];
  let i = 0;
  while (i < idsToDelete.length) {
    const currId = idsToDelete[i];
    const childIds = elements.filter((el) => el.parentId === currId).map((el) => el.id);
    idsToDelete.push(...childIds);
    i++;
  }
  return idsToDelete;
}

export function moveLayerElements(
  elements: CanvasElement[],
  id: string,
  direction: "up" | "down"
): CanvasElement[] | null {
  const idx = elements.findIndex((el) => el.id === id);
  if (idx === -1) return null;

  const current = elements[idx];
  if (current.isDefault || id === "flexbox-default") return null;

  const copy = [...elements];
  if (current.parentId) {
    const siblings = copy.filter((el) => el.parentId === current.parentId);
    const sibIdx = siblings.findIndex((el) => el.id === id);
    const targetSibIdx = direction === "up" ? sibIdx - 1 : sibIdx + 1;
    if (targetSibIdx >= 0 && targetSibIdx < siblings.length) {
      const targetEl = siblings[targetSibIdx];
      const targetRealIdx = copy.findIndex((el) => el.id === targetEl.id);
      copy[idx] = targetEl;
      copy[targetRealIdx] = current;
      return copy;
    }
    return null;
  }

  const roots = copy.filter((el) => !el.parentId);
  const rootIdx = roots.findIndex((el) => el.id === id);
  const targetRootIdx = direction === "up" ? rootIdx - 1 : rootIdx + 1;
  if (targetRootIdx < 0 || targetRootIdx >= roots.length) return null;

  const targetRoot = roots[targetRootIdx];
  const newRoots = [...roots];
  newRoots[rootIdx] = targetRoot;
  newRoots[targetRootIdx] = current;

  const newElements: CanvasElement[] = [];
  for (const r of newRoots) {
    newElements.push(r);
    newElements.push(...copy.filter((el) => el.parentId === r.id));
  }
  const orphans = copy.filter((el) => el.parentId && !newRoots.some((r) => r.id === el.parentId));
  newElements.push(...orphans);
  return newElements;
}

export function reorderLayerElements(
  elements: CanvasElement[],
  draggedId: string,
  targetId: string,
  position: "before" | "after"
): CanvasElement[] | null {
  if (draggedId === targetId) return null;

  const dragged = elements.find((el) => el.id === draggedId);
  const target = elements.find((el) => el.id === targetId);
  if (!dragged || !target) return null;

  if (dragged.isDefault || dragged.id === "flexbox-default") return null;
  if ((target.isDefault || target.id === "flexbox-default") && position === "before") return null;

  let newParentId = target.parentId;
  if (target.type === "frame" && !target.parentId && position === "after") {
    newParentId = target.id;
  }

  const updatedDragged: CanvasElement = { ...dragged, parentId: newParentId };
  const draggedChildren = elements.filter((el) => el.parentId === dragged.id);
  const draggedIds = [dragged.id, ...draggedChildren.map((c) => c.id)];
  const remaining = elements.filter((el) => !draggedIds.includes(el.id));

  const targetIdx = remaining.findIndex((el) => el.id === targetId);
  if (targetIdx === -1) return null;

  const insertIdx = position === "before" ? targetIdx : targetIdx + 1;
  return [
    ...remaining.slice(0, insertIdx),
    updatedDragged,
    ...draggedChildren,
    ...remaining.slice(insertIdx)
  ];
}

export function ensureDefaultRootFrame(
  elements: CanvasElement[],
  defaultName: "header" | "footer" | "main",
  frame: CanvasFrame,
  targetType?: EditorTargetType | null
): CanvasElement[] {
  const copy = [...elements];
  let defaultFrame =
    copy.find((el) => el.isDefault || el.id === "flexbox-default") ||
    copy.find((el) => !el.parentId && el.type === "frame");

  if (defaultFrame) {
    defaultFrame.isDefault = true;
    defaultFrame.name = defaultName;
  } else {
    defaultFrame = {
      id: "flexbox-default",
      name: defaultName,
      type: "frame",
      isDefault: true,
      x: 0,
      y: 0,
      width: frame.width || 1280,
      height: frame.height || (targetType === "header" ? 70 : targetType === "footer" ? 80 : 520),
      fill: "#ffffff",
      borderRadius: 0,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderStyle: "solid",
      opacity: 100,
      boxShadow: "none",
      isAutoLayout: true,
      flexDirection: targetType === "header" || targetType === "footer" ? "row" : "column",
      justifyContent:
        targetType === "header" || targetType === "footer" ? "space-between" : "center",
      alignItems: "center",
      padding: 20
    };
    copy.unshift(defaultFrame);
  }
  return copy;
}

export function parseLoadedEditorJson(
  jsonString: string,
  currentFrame: CanvasFrame,
  targetType?: EditorTargetType | null
): { frame: CanvasFrame; elements?: CanvasElement[] } | null {
  try {
    const parsed = JSON.parse(jsonString) as { elements?: CanvasElement[]; frame?: CanvasFrame };
    const nextFrame = parsed.frame
      ? {
          ...currentFrame,
          ...parsed.frame,
          minHeight: parsed.frame.minHeight ?? parsed.frame.height ?? 80
        }
      : currentFrame;
    const defaultName =
      targetType === "header" ? "header" : targetType === "footer" ? "footer" : "main";
    const nextElements = Array.isArray(parsed.elements)
      ? ensureDefaultRootFrame(parsed.elements, defaultName, nextFrame, targetType)
      : undefined;
    return { frame: nextFrame, elements: nextElements };
  } catch (err) {
    console.warn("Failed to parse editor JSON content:", err);
    return null;
  }
}
