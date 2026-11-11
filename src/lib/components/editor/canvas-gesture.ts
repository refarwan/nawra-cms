import type { EditorState } from "./editor-state.svelte";
import type { CanvasElement } from "./types";

export function getElTotalHeight(el: CanvasElement): number {
  const pt = el.paddingTop ?? el.padding ?? 0;
  const pb = el.paddingBottom ?? el.padding ?? 0;
  return (el.height || 0) + pt + pb;
}

export function getElTotalWidth(el: CanvasElement): number {
  const pl = el.paddingLeft ?? el.padding ?? 0;
  const pr = el.paddingRight ?? el.padding ?? 0;
  return (el.width || 0) + pl + pr;
}

export function getActiveFollower(
  editor: EditorState,
  isPanActive: boolean,
  isCanvasPanning: boolean
): { type: string; label: string } | null {
  if (isPanActive || isCanvasPanning || editor.isPreviewMode) return null;

  if (editor.pendingElementType) {
    const type = editor.pendingElementType;
    const labelMap: Record<string, string> = {
      heading: "Judul",
      text: "Paragraf Teks",
      button: "Tombol",
      link: "Tautan",
      image: "Gambar",
      icon: "Ikon",
      frame: "Flexbox",
      youtube: "Iframe YouTube"
    };
    return { type, label: labelMap[type] || type };
  }

  if (editor.selectedElement) {
    const type = editor.selectedElement.type;
    if (
      type === "heading" ||
      type === "text" ||
      type === "button" ||
      type === "youtube" ||
      type === "link" ||
      type === "image" ||
      type === "icon" ||
      type === "frame"
    ) {
      return { type, label: editor.selectedElement.name };
    }
  }
  return null;
}

export function computeResizedElementUpdates(
  resizeHandle: string,
  initialBox: { x: number; y: number; w: number; h: number },
  dx: number,
  dy: number
): Partial<CanvasElement> {
  let newX = initialBox.x;
  let newY = initialBox.y;
  let newW = initialBox.w;
  let newH = initialBox.h;

  if (resizeHandle.includes("e")) newW = Math.max(20, initialBox.w + dx);
  if (resizeHandle.includes("s")) newH = Math.max(20, initialBox.h + dy);
  if (resizeHandle.includes("w")) {
    const potentialW = initialBox.w - dx;
    if (potentialW > 20) {
      newW = potentialW;
      newX = initialBox.x + dx;
    }
  }
  if (resizeHandle.includes("n")) {
    const potentialH = initialBox.h - dy;
    if (potentialH > 20) {
      newH = potentialH;
      newY = initialBox.y + dy;
    }
  }

  const updates: Partial<CanvasElement> = {
    x: Math.round(newX),
    y: Math.round(newY),
    width: Math.round(newW),
    height: Math.round(newH)
  };
  if (resizeHandle.includes("e") || resizeHandle.includes("w")) updates.widthMode = "fixed";
  if (resizeHandle.includes("n") || resizeHandle.includes("s")) updates.heightMode = "fixed";
  return updates;
}

export function createGestureAction(editor: EditorState) {
  return function gestureAction(node: HTMLElement) {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = Math.exp(-e.deltaY * 0.01);
        editor.zoom = Math.min(3.0, Math.max(0.15, Number((editor.zoom * zoomFactor).toFixed(2))));
      } else {
        editor.pan = {
          x: Math.round(editor.pan.x - e.deltaX),
          y: Math.round(editor.pan.y - e.deltaY)
        };
      }
    };

    let initialDistance = 0;
    let initialZoom = 1;
    let initialPan = { x: 0, y: 0 };
    let initialCenter = { x: 0, y: 0 };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const [t1, t2] = [e.touches[0], e.touches[1]];
        initialDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialZoom = editor.zoom;
        initialPan = { ...editor.pan };
        initialCenter = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const [t1, t2] = [e.touches[0], e.touches[1]];
        const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        if (initialDistance > 0) {
          const scale = currentDistance / initialDistance;
          editor.zoom = Math.min(3.0, Math.max(0.15, Number((initialZoom * scale).toFixed(2))));
        }
        const currentCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
        editor.pan = {
          x: Math.round(initialPan.x + (currentCenter.x - initialCenter.x)),
          y: Math.round(initialPan.y + (currentCenter.y - initialCenter.y))
        };
      }
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    node.addEventListener("touchstart", onTouchStart, { passive: false });
    node.addEventListener("touchmove", onTouchMove, { passive: false });

    return {
      destroy() {
        node.removeEventListener("wheel", handleWheel);
        node.removeEventListener("touchstart", onTouchStart);
        node.removeEventListener("touchmove", onTouchMove);
      }
    };
  };
}
