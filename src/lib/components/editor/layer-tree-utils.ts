import type { CanvasElement } from "./types";

export function getElementDepth(elements: CanvasElement[], id: string): number {
  let depth = 0;
  let curr = elements.find((el) => el.id === id);
  while (curr && curr.parentId) {
    depth++;
    const parentId: string = curr.parentId;
    curr = elements.find((el) => el.id === parentId);
  }
  return depth;
}

export function getOrderedLayerElements(elements: CanvasElement[]): CanvasElement[] {
  const result: CanvasElement[] = [];
  function addTree(parentId: string | null) {
    const children = elements.filter((el) =>
      parentId === null ? !el.parentId : el.parentId === parentId
    );
    for (const child of children) {
      result.push(child);
      if (child.type === "frame") {
        addTree(child.id);
      }
    }
  }
  addTree(null);
  for (const el of elements) {
    if (!result.some((r) => r.id === el.id)) {
      result.push(el);
    }
  }
  return result;
}

export function getLayerTypeIcon(type: CanvasElement["type"]): string {
  switch (type) {
    case "heading":
      return "lucide:heading";
    case "text":
      return "lucide:type";
    case "button":
      return "lucide:rectangle-horizontal";
    case "link":
      return "lucide:link-2";
    case "youtube":
      return "lucide:video";
    case "frame":
      return "lucide:columns-2";
    case "badge":
      return "lucide:tag";
    case "image":
      return "lucide:image";
    case "icon":
      return "lucide:smile";
    case "rectangle":
    default:
      return "lucide:square";
  }
}
