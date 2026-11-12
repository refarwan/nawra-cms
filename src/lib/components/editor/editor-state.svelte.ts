import { SvelteDate } from "svelte/reactivity";

import { INITIAL_ELEMENTS, INITIAL_FRAME } from "./canvas-element-factory";
import {
  addCanvasChildToFrame,
  createAndAddRootElement,
  deleteCanvasElement,
  duplicateCanvasElement,
  toggleElementLock,
  toggleElementVisibility
} from "./editor-element-actions";
import {
  applyDeviceDimensions,
  moveLayerElements,
  parseLoadedEditorJson,
  reorderLayerElements
} from "./layer-utils";
import {
  applyElementUpdate,
  resolveElementForDevice,
  updateDeviceWithPreservedScroll
} from "./responsive-utils";

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

  selectedElement = $derived.by<CanvasElement | null>(() => {
    const raw = this.elements.find((el) => el.id === this.selectedId);
    return raw ? resolveElementForDevice(raw, this.device) : null;
  });

  resolvedElements = $derived.by<CanvasElement[]>(() =>
    this.elements.map((el) => resolveElementForDevice(el, this.device))
  );

  constructor() {
    this.pushHistory();
  }

  setDevice(device: DeviceMode) {
    this.device = device;
    const res = updateDeviceWithPreservedScroll(
      this.frame,
      this.elements,
      this.pan,
      this.zoom,
      device
    );
    this.zoom = res.zoom;
    this.pan = res.pan;
  }

  pushHistory() {
    const next = this.history.slice(0, this.historyIndex + 1);
    next.push(JSON.parse(JSON.stringify(this.elements)));
    this.history = next;
    this.historyIndex = next.length - 1;
  }

  undo() {
    if (this.historyIndex > 0)
      this.elements = JSON.parse(JSON.stringify(this.history[--this.historyIndex]));
  }

  redo() {
    if (this.historyIndex < this.history.length - 1)
      this.elements = JSON.parse(JSON.stringify(this.history[++this.historyIndex]));
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
    const res = addCanvasChildToFrame(this.elements, frameId, type, dir);
    if (!res) return;
    this.elements = res.updatedElements;
    this.selectedId = res.newId;
    this.pendingElementType = null;
    this.pushHistory();
  }

  addElement(type: ElementType, x = 80, y = 80) {
    const res = createAndAddRootElement(this.elements, type, x, y);
    this.elements = res.updatedElements;
    this.selectedId = res.newId;
    this.tool = "select";
    this.pushHistory();
  }

  updateElement(id: string, updates: Partial<CanvasElement>) {
    const idx = this.elements.findIndex((el) => el.id === id);
    if (idx === -1) return;
    const target = this.elements[idx];
    const isDef = target.isDefault || id === "flexbox-default";
    if (isDef && "name" in updates) delete updates.name;
    this.elements[idx] = applyElementUpdate(target, updates, this.device);
    if (isDef && updates.height) {
      this.frame.height = updates.height;
      this.frame.minHeight = updates.height;
    }
  }

  commitUpdate = () => this.pushHistory();

  deleteElement(id: string) {
    const res = deleteCanvasElement(this.elements, id, this.selectedId);
    if (!res) return;
    this.elements = res.updatedElements;
    this.selectedId = res.nextSelectedId;
    this.pushHistory();
  }

  duplicateElement(id: string) {
    const res = duplicateCanvasElement(this.elements, id);
    if (!res) return;
    this.elements = res.updatedElements;
    this.selectedId = res.clonedId;
    this.pushHistory();
  }

  moveLayer(id: string, direction: "up" | "down") {
    const next = moveLayerElements(this.elements, id, direction);
    if (!next) return;
    this.elements = next;
    this.pushHistory();
  }

  reorderLayers(draggedId: string, targetId: string, position: "before" | "after") {
    const next = reorderLayerElements(this.elements, draggedId, targetId, position);
    if (!next) return;
    this.elements = next;
    this.pushHistory();
  }

  toggleVisibility(id: string) {
    if (toggleElementVisibility(this.elements, id)) this.pushHistory();
  }

  toggleLock(id: string) {
    if (toggleElementLock(this.elements, id)) this.pushHistory();
  }

  loadFromJson(jsonString: string, title?: string, type?: EditorTargetType, id?: string) {
    if (type) this.targetType = type;
    if (id) this.targetId = id;
    const res = parseLoadedEditorJson(jsonString, this.frame, this.targetType);
    if (title) this.frame.name = title;
    if (!res) return;
    this.frame = res.frame;
    if (res.elements) this.elements = res.elements;
    this.zoom = applyDeviceDimensions(this.frame, this.elements, this.device);
    this.history = [JSON.parse(JSON.stringify(this.elements))];
    this.historyIndex = 0;
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
