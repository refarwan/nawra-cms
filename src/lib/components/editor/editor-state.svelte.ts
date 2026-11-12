import { SvelteDate } from "svelte/reactivity";

import {
  cloneCanvasElement,
  createRootCanvasElement,
  INITIAL_ELEMENTS,
  INITIAL_FRAME
} from "./canvas-element-factory";
import { buildChildForFrame } from "./frame-element-factory";
import {
  applyDeviceDimensions,
  collectDeleteIds,
  moveLayerElements,
  parseLoadedEditorJson,
  reorderLayerElements
} from "./layer-utils";

import type {
  CanvasElement,
  CanvasFrame,
  DeviceMode,
  EditorTargetType,
  ElementType,
  ToolMode
} from "./types";

export class EditorState {
  elements = $state<CanvasElement[]>(INITIAL_ELEMENTS);
  frame = $state<CanvasFrame>({ ...INITIAL_FRAME });
  selectedId = $state<string | null>(null);
  tool = $state<ToolMode>("select");
  pendingElementType = $state<ElementType | null>(null);
  pendingFrameDirection = $state<"row" | "column">("row");
  zoom = $state<number>(1);
  pan = $state<{ x: number; y: number }>({ x: 0, y: 0 });
  device = $state<DeviceMode>("desktop");
  isPreviewMode = $state<boolean>(false);
  isPublishModalOpen = $state<boolean>(false);
  lastPublishedAt = $state<string | null>("Baru Saja");
  history = $state<CanvasElement[][]>([]);
  historyIndex = $state<number>(-1);
  targetType = $state<EditorTargetType | null>(null);
  targetId = $state<string | null>(null);
  publishStatus = $state<"published" | "draft">("published");
  isSaving = $state<boolean>(false);

  selectedElement = $derived<CanvasElement | null>(
    this.elements.find((el) => el.id === this.selectedId) || null
  );

  constructor() {
    this.pushHistory();
  }

  setDevice(device: DeviceMode) {
    this.device = device;
    this.zoom = applyDeviceDimensions(this.frame, this.elements, device);
    this.pan = { x: 0, y: 0 };
  }

  pushHistory() {
    const next = this.history.slice(0, this.historyIndex + 1);
    next.push(JSON.parse(JSON.stringify(this.elements)));
    this.history = next;
    this.historyIndex = next.length - 1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.elements = JSON.parse(JSON.stringify(this.history[--this.historyIndex]));
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.elements = JSON.parse(JSON.stringify(this.history[++this.historyIndex]));
    }
  }

  selectElement = (id: string | null) => (this.selectedId = id);

  setPendingElementType(type: ElementType | null, direction: "row" | "column" = "row") {
    this.pendingElementType = type;
    if (type === "frame") this.pendingFrameDirection = direction;
  }

  addElementToFrame(
    frameId: string,
    type: ElementType,
    options?: { flexDirection?: "row" | "column" }
  ) {
    const dir = options?.flexDirection ?? this.pendingFrameDirection ?? "row";
    const newEl = buildChildForFrame(this.elements, frameId, type, dir);
    if (!newEl) return;
    this.elements.push(newEl);
    this.selectedId = newEl.id;
    this.pendingElementType = null;
    this.pushHistory();
  }

  addElement(type: ElementType, x = 80, y = 80) {
    const newEl = createRootCanvasElement(type, this.elements.length + 1, x, y);
    this.elements.push(newEl);
    this.selectedId = newEl.id;
    this.tool = "select";
    this.pushHistory();
  }

  updateElement(id: string, updates: Partial<CanvasElement>) {
    const idx = this.elements.findIndex((el) => el.id === id);
    if (idx === -1) return;
    const target = this.elements[idx];
    if ((target.isDefault || id === "flexbox-default") && "name" in updates) delete updates.name;
    this.elements[idx] = { ...target, ...updates };
    if ((target.isDefault || id === "flexbox-default") && updates.height) {
      this.frame.height = updates.height;
      this.frame.minHeight = updates.height;
    }
  }

  commitUpdate = () => this.pushHistory();

  deleteElement(id: string) {
    const target = this.elements.find((el) => el.id === id);
    if (target?.isDefault || id === "flexbox-default") return;
    const ids = collectDeleteIds(this.elements, id);
    this.elements = this.elements.filter((el) => !ids.includes(el.id));
    if (this.selectedId && ids.includes(this.selectedId)) this.selectedId = null;
    this.pushHistory();
  }

  duplicateElement(id: string) {
    const target = this.elements.find((el) => el.id === id);
    if (!target || target.isDefault || id === "flexbox-default") return;
    const clone = cloneCanvasElement(target);
    this.elements.push(clone);
    this.selectedId = clone.id;
    this.pushHistory();
  }

  moveLayer(id: string, direction: "up" | "down") {
    const next = moveLayerElements(this.elements, id, direction);
    if (next) {
      this.elements = next;
      this.pushHistory();
    }
  }

  reorderLayers(draggedId: string, targetId: string, position: "before" | "after") {
    const next = reorderLayerElements(this.elements, draggedId, targetId, position);
    if (next) {
      this.elements = next;
      this.pushHistory();
    }
  }

  toggleVisibility(id: string) {
    const el = this.elements.find((e) => e.id === id);
    if (el) {
      el.hidden = !el.hidden;
      this.pushHistory();
    }
  }

  toggleLock(id: string) {
    const el = this.elements.find((e) => e.id === id);
    if (el) {
      el.locked = !el.locked;
      this.pushHistory();
    }
  }

  loadFromJson(jsonString: string, title?: string, type?: EditorTargetType, id?: string) {
    if (type) this.targetType = type;
    if (id) this.targetId = id;
    const res = parseLoadedEditorJson(jsonString, this.frame, this.targetType);
    if (res) {
      this.frame = res.frame;
      if (title) this.frame.name = title;
      if (res.elements) this.elements = res.elements;
      this.history = [JSON.parse(JSON.stringify(this.elements))];
      this.historyIndex = 0;
    } else if (title) {
      this.frame.name = title;
    }
  }

  publish(status: "published" | "draft" = "published") {
    this.publishStatus = status;
    this.isPublishModalOpen = true;
    this.lastPublishedAt = new SvelteDate().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  zoomIn = () => (this.zoom = Math.min(2.5, +(this.zoom + 0.1).toFixed(2)));
  zoomOut = () => (this.zoom = Math.max(0.3, +(this.zoom - 0.1).toFixed(2)));
  resetZoom = () => ((this.zoom = 1), (this.pan = { x: 0, y: 0 }));
}
