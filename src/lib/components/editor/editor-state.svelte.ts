import { SvelteDate } from "svelte/reactivity";

import type {
  CanvasElement,
  CanvasFrame,
  DeviceMode,
  EditorTargetType,
  ElementType,
  ToolMode
} from "./types";

const INITIAL_ELEMENTS: CanvasElement[] = [];

export class EditorState {
  elements = $state<CanvasElement[]>(INITIAL_ELEMENTS);
  frame = $state<CanvasFrame>({
    name: "Kanvas Desain Utama",
    width: 1280,
    height: 720,
    minHeight: 720,
    background: "#ffffff"
  });

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

  selectedElement = $derived<CanvasElement | null>(
    this.elements.find((el) => el.id === this.selectedId) || null
  );

  constructor() {
    this.pushHistory();
  }

  setDevice(device: DeviceMode) {
    this.device = device;
    if (device === "mobile") {
      this.frame.width = 390;
      this.frame.minHeight = 780;
      this.zoom = 0.9;
    } else if (device === "tablet") {
      this.frame.width = 768;
      this.frame.minHeight = 900;
      this.zoom = 0.85;
    } else {
      this.frame.width = 1280;
      this.frame.minHeight = 720;
      this.zoom = 1;
    }
    // Pastikan container bawaan menyesuaikan lebar kanvas
    const defaultFb = this.elements.find((el) => el.isDefault || el.id === "flexbox-default");
    if (defaultFb) {
      defaultFb.x = 0;
      defaultFb.y = 0;
      defaultFb.width = this.frame.width;
    }
    this.pan = { x: 0, y: 0 };
  }

  pushHistory() {
    const nextHistory = this.history.slice(0, this.historyIndex + 1);
    nextHistory.push(JSON.parse(JSON.stringify(this.elements)));
    this.history = nextHistory;
    this.historyIndex = nextHistory.length - 1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
    }
  }

  selectElement(id: string | null) {
    this.selectedId = id;
  }

  setPendingElementType(type: ElementType | null, direction: "row" | "column" = "row") {
    this.pendingElementType = type;
    if (type === "frame") {
      this.pendingFrameDirection = direction;
    }
  }

  addElementToFrame(
    frameId: string,
    type: ElementType,
    options?: { flexDirection?: "row" | "column" }
  ) {
    const parent = this.elements.find((el) => el.id === frameId);
    if (!parent || parent.type !== "frame") return;

    const count = this.elements.filter((el) => el.parentId === frameId).length + 1;
    const id = `el-${Date.now()}`;
    const padLeft = parent.paddingLeft ?? parent.padding ?? 0;
    const padRight = parent.paddingRight ?? parent.padding ?? 0;
    const maxInnerWidth = Math.max(120, (parent.width || 320) - (padLeft + padRight));

    let newEl: CanvasElement;

    switch (type) {
      case "heading":
        newEl = {
          id,
          parentId: frameId,
          name: `Judul ${count}`,
          type: "heading",
          x: 0,
          y: 0,
          width: Math.min(maxInnerWidth, 260),
          height: 48,
          rotation: 0,
          widthMode: "hug",
          heightMode: "hug",
          content: "Judul Konten",
          fill: "transparent",
          color: "#0f172a",
          fontSize: 24,
          fontWeight: "700",
          fontFamily: "Inter",
          textAlign: "left",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      case "text":
        newEl = {
          id,
          parentId: frameId,
          name: `Paragraf ${count}`,
          type: "text",
          x: 0,
          y: 0,
          width: Math.min(maxInnerWidth, 260),
          height: 60,
          rotation: 0,
          widthMode: "fixed",
          heightMode: "hug",
          content: "Tulis penjelasan konten atau paragraf informasi di sini.",
          fill: "transparent",
          color: "#475569",
          fontSize: 14,
          fontWeight: "400",
          fontFamily: "Inter",
          textAlign: "left",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      case "button":
        newEl = {
          id,
          parentId: frameId,
          name: `Tombol ${count}`,
          type: "button",
          x: 0,
          y: 0,
          width: Math.min(maxInnerWidth, 140),
          height: 42,
          rotation: 0,
          widthMode: "hug",
          heightMode: "hug",
          content: "Tombol Aksi",
          fill: "#0d99ff",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: "600",
          fontFamily: "Inter",
          textAlign: "center",
          borderRadius: 8,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "0 4px 12px rgba(13, 153, 255, 0.3)"
        };
        break;
      case "link":
        newEl = {
          id,
          parentId: frameId,
          name: `Tautan ${count}`,
          type: "link",
          x: 0,
          y: 0,
          width: Math.min(maxInnerWidth, 150),
          height: 32,
          rotation: 0,
          widthMode: "hug",
          heightMode: "hug",
          content: "Tautan Halaman →",
          href: "https://example.com",
          fill: "transparent",
          color: "#0d99ff",
          fontSize: 14,
          fontWeight: "600",
          fontFamily: "Inter",
          textAlign: "left",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      case "image": {
        const imgWidth = Math.min(maxInnerWidth, 280);
        const imgHeight = Math.min(180, Math.round(imgWidth * 0.65));
        newEl = {
          id,
          parentId: frameId,
          name: `Gambar ${count}`,
          type: "image",
          x: 0,
          y: 0,
          width: imgWidth,
          height: imgHeight,
          rotation: 0,
          widthMode: "fixed",
          heightMode: "fixed",
          src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
          fill: "transparent",
          borderRadius: 8,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      }
      case "frame": {
        const dir = options?.flexDirection ?? this.pendingFrameDirection ?? "row";
        newEl = {
          id,
          parentId: frameId,
          name: `Flexbox ${dir === "row" ? "Baris" : "Kolom"} ${count}`,
          type: "frame",
          x: 0,
          y: 0,
          width: 320,
          height: 80,
          rotation: 0,
          widthMode: "fixed",
          heightMode: "fixed",
          fill: "transparent",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none",
          isAutoLayout: true,
          flexDirection: dir,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 0,
          gapX: 0,
          gapY: 0,
          padding: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          margin: 0,
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0
        };
        break;
      }
      case "icon": {
        const iconSize = Math.min(maxInnerWidth, 48);
        newEl = {
          id,
          parentId: frameId,
          name: `Ikon ${count}`,
          type: "icon",
          x: 0,
          y: 0,
          width: iconSize,
          height: iconSize,
          rotation: 0,
          widthMode: "fixed",
          heightMode: "fixed",
          icon: "lucide:smile",
          fill: "transparent",
          color: "#0d99ff",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      }
      case "youtube": {
        const ytWidth = Math.min(maxInnerWidth, 380);
        const ytHeight = Math.min(220, Math.round(ytWidth * 0.58));
        newEl = {
          id,
          parentId: frameId,
          name: `Iframe YouTube ${count}`,
          type: "youtube",
          x: 0,
          y: 0,
          width: ytWidth,
          height: ytHeight,
          rotation: 0,
          widthMode: "fixed",
          heightMode: "fixed",
          src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          fill: "#0f172a",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#334155",
          borderStyle: "solid",
          opacity: 100,
          boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
        };
        break;
      }
      default:
        newEl = {
          id,
          parentId: frameId,
          name: `Elemen ${count}`,
          type,
          x: 0,
          y: 0,
          width: 180,
          height: 60,
          rotation: 0,
          content: "Konten Baru",
          fill: "#1e293b",
          borderRadius: 8,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
    }

    this.elements.push(newEl);
    this.selectedId = id;
    this.pendingElementType = null;
    this.pushHistory();
  }

  addElement(type: ElementType, x = 80, y = 80) {
    const count = this.elements.length + 1;
    const id = `el-${Date.now()}`;

    let newEl: CanvasElement;

    switch (type) {
      case "heading":
        newEl = {
          id,
          name: `Judul ${count}`,
          type: "heading",
          x,
          y,
          width: 400,
          height: 60,
          rotation: 0,
          content: "Judul Baru",
          fill: "transparent",
          color: "#0f172a",
          fontSize: 32,
          fontWeight: "700",
          fontFamily: "Inter",
          textAlign: "left",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      case "text":
        newEl = {
          id,
          name: `Teks ${count}`,
          type: "text",
          x,
          y,
          width: 320,
          height: 60,
          rotation: 0,
          content: "Tulis penjelasan konten atau paragraf informasi di sini.",
          fill: "transparent",
          color: "#475569",
          fontSize: 16,
          fontWeight: "400",
          fontFamily: "Inter",
          textAlign: "left",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      case "button":
        newEl = {
          id,
          name: `Tombol ${count}`,
          type: "button",
          x,
          y,
          width: 160,
          height: 44,
          rotation: 0,
          content: "Klik Di Sini",
          fill: "#0d99ff",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: "600",
          fontFamily: "Inter",
          textAlign: "center",
          borderRadius: 8,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "0 4px 12px rgba(13, 153, 255, 0.3)"
        };
        break;
      case "badge":
        newEl = {
          id,
          name: `Tag / Badge ${count}`,
          type: "badge",
          x,
          y,
          width: 140,
          height: 32,
          rotation: 0,
          content: "LABEL BARU",
          fill: "#1e293b",
          color: "#38bdf8",
          fontSize: 12,
          fontWeight: "600",
          fontFamily: "Inter",
          textAlign: "center",
          borderRadius: 999,
          borderWidth: 1,
          borderColor: "#0284c7",
          borderStyle: "solid",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      case "image":
        newEl = {
          id,
          name: `Gambar ${count}`,
          type: "image",
          x,
          y,
          width: 280,
          height: 200,
          rotation: 0,
          src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
          fill: "#1e293b",
          borderRadius: 12,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
        };
        break;
      case "link":
        newEl = {
          id,
          name: `Tautan ${count}`,
          type: "link",
          x,
          y,
          width: 180,
          height: 36,
          rotation: 0,
          content: "Tautan Menuju Halaman →",
          href: "https://example.com",
          fill: "transparent",
          color: "#0d99ff",
          fontSize: 14,
          fontWeight: "600",
          fontFamily: "Inter",
          textAlign: "left",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      case "icon":
        newEl = {
          id,
          name: `Ikon ${count}`,
          type: "icon",
          x,
          y,
          width: 48,
          height: 48,
          rotation: 0,
          icon: "lucide:smile",
          fill: "transparent",
          color: "#0d99ff",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none"
        };
        break;
      case "youtube":
        newEl = {
          id,
          name: `Iframe YouTube ${count}`,
          type: "youtube",
          x,
          y,
          width: 480,
          height: 270,
          rotation: 0,
          src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          fill: "#0f172a",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#334155",
          borderStyle: "solid",
          opacity: 100,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)"
        };
        break;
      case "frame":
        newEl = {
          id,
          name: `Flexbox ${count}`,
          type: "frame",
          x,
          y,
          width: 320,
          height: 80,
          rotation: 0,
          widthMode: "fixed",
          heightMode: "fixed",
          fill: "transparent",
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "transparent",
          borderStyle: "none",
          opacity: 100,
          boxShadow: "none",
          isAutoLayout: true,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 0,
          gapX: 0,
          gapY: 0,
          padding: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          margin: 0,
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0
        };
        break;
      case "rectangle":
      default:
        newEl = {
          id,
          name: `Kontainer / Kartu ${count}`,
          type: "rectangle",
          x,
          y,
          width: 300,
          height: 180,
          rotation: 0,
          fill: "#1e293b",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#334155",
          borderStyle: "solid",
          opacity: 100,
          boxShadow: "none"
        };
        break;
    }

    this.elements.push(newEl);
    this.selectedId = id;
    this.tool = "select";
    this.pushHistory();
  }

  updateElement(id: string, updates: Partial<CanvasElement>) {
    const idx = this.elements.findIndex((el) => el.id === id);
    if (idx !== -1) {
      const target = this.elements[idx];
      if ((target.isDefault || id === "flexbox-default") && "name" in updates) {
        delete updates.name;
      }
      this.elements[idx] = { ...this.elements[idx], ...updates };

      // Sinkronkan tinggi kanvas dengan tinggi container bawaan
      if ((target.isDefault || id === "flexbox-default") && updates.height) {
        this.frame.height = updates.height;
      }
    }
  }

  commitUpdate() {
    this.pushHistory();
  }

  deleteElement(id: string) {
    const target = this.elements.find((el) => el.id === id);
    if (target?.isDefault || id === "flexbox-default") return;

    const idsToDelete = [id];
    let i = 0;
    while (i < idsToDelete.length) {
      const currId = idsToDelete[i];
      const childIds = this.elements.filter((el) => el.parentId === currId).map((el) => el.id);
      idsToDelete.push(...childIds);
      i++;
    }

    this.elements = this.elements.filter((el) => !idsToDelete.includes(el.id));
    if (this.selectedId && idsToDelete.includes(this.selectedId)) {
      this.selectedId = null;
    }
    this.pushHistory();
  }

  duplicateElement(id: string) {
    const target = this.elements.find((el) => el.id === id);
    if (!target) return;

    const clone: CanvasElement = {
      ...JSON.parse(JSON.stringify(target)),
      id: `el-${Date.now()}`,
      name: `${target.name} (Salinan)`,
      x: target.x + 20,
      y: target.y + 20,
      isDefault: false
    };

    this.elements.push(clone);
    this.selectedId = clone.id;
    this.pushHistory();
  }

  moveLayer(id: string, direction: "up" | "down") {
    const idx = this.elements.findIndex((el) => el.id === id);
    if (idx === -1) return;

    const current = this.elements[idx];
    // Flexbox bawaan selalu tetap di posisi teratas
    if (current.isDefault || id === "flexbox-default") return;

    // If element is a child inside a parent, move among siblings
    if (current.parentId) {
      const siblings = this.elements.filter((el) => el.parentId === current.parentId);
      const sibIdx = siblings.findIndex((el) => el.id === id);
      const targetSibIdx = direction === "up" ? sibIdx - 1 : sibIdx + 1;
      if (targetSibIdx >= 0 && targetSibIdx < siblings.length) {
        const targetEl = siblings[targetSibIdx];
        const targetRealIdx = this.elements.findIndex((el) => el.id === targetEl.id);
        this.elements[idx] = targetEl;
        this.elements[targetRealIdx] = current;
        this.pushHistory();
      }
      return;
    }

    // If element is a root, reorder roots together with their children
    const roots = this.elements.filter((el) => !el.parentId);
    const rootIdx = roots.findIndex((el) => el.id === id);
    const targetRootIdx = direction === "up" ? rootIdx - 1 : rootIdx + 1;
    if (targetRootIdx >= 0 && targetRootIdx < roots.length) {
      const targetRoot = roots[targetRootIdx];
      const newRoots = [...roots];
      newRoots[rootIdx] = targetRoot;
      newRoots[targetRootIdx] = current;

      const newElements: CanvasElement[] = [];
      for (const r of newRoots) {
        newElements.push(r);
        newElements.push(...this.elements.filter((el) => el.parentId === r.id));
      }
      const orphans = this.elements.filter(
        (el) => el.parentId && !newRoots.some((r) => r.id === el.parentId)
      );
      newElements.push(...orphans);

      this.elements = newElements;
      this.pushHistory();
    }
  }

  reorderLayers(draggedId: string, targetId: string, position: "before" | "after") {
    if (draggedId === targetId) return;

    const dragged = this.elements.find((el) => el.id === draggedId);
    const target = this.elements.find((el) => el.id === targetId);
    if (!dragged || !target) return;

    // Flexbox bawaan tidak bisa dipindah dari posisi teratas
    if (dragged.isDefault || dragged.id === "flexbox-default") return;
    if ((target.isDefault || target.id === "flexbox-default") && position === "before") return;

    // Tentukan parentId baru untuk dragged
    let newParentId = target.parentId;
    if (target.type === "frame" && !target.parentId && position === "after") {
      // Jika didrop setelah frame, jadikan anak pertama dari frame tersebut
      newParentId = target.id;
    }

    dragged.parentId = newParentId;

    // Ambil blok dragged beserta anak-anaknya (jika dragged adalah frame)
    const draggedChildren = this.elements.filter((el) => el.parentId === dragged.id);
    const draggedIds = [dragged.id, ...draggedChildren.map((c) => c.id)];

    // Elemen selain dragged
    const remaining = this.elements.filter((el) => !draggedIds.includes(el.id));

    const targetIdx = remaining.findIndex((el) => el.id === targetId);
    if (targetIdx === -1) return;

    const insertIdx = position === "before" ? targetIdx : targetIdx + 1;

    // Susun kembali array elemen
    const newElements = [
      ...remaining.slice(0, insertIdx),
      dragged,
      ...draggedChildren,
      ...remaining.slice(insertIdx)
    ];

    this.elements = newElements;
    this.pushHistory();
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

  targetType = $state<EditorTargetType | null>(null);
  targetId = $state<string | null>(null);
  isSaving = $state<boolean>(false);

  loadFromJson(jsonString: string, title?: string, type?: EditorTargetType, id?: string) {
    if (type) this.targetType = type;
    if (id) this.targetId = id;
    if (title) this.frame.name = title;

    try {
      const parsed = JSON.parse(jsonString) as {
        elements?: CanvasElement[];
        frame?: CanvasFrame;
      };
      if (Array.isArray(parsed.elements)) {
        this.elements = parsed.elements;
      }
      if (parsed.frame) {
        this.frame = { ...this.frame, ...parsed.frame };
      }
      this.history = [JSON.parse(JSON.stringify(this.elements))];
      this.historyIndex = 0;
    } catch (err) {
      console.warn("Failed to parse editor JSON content:", err);
    }
  }

  publish() {
    this.isPublishModalOpen = true;
    this.lastPublishedAt = new SvelteDate().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  zoomIn() {
    this.zoom = Math.min(2.5, +(this.zoom + 0.1).toFixed(2));
  }

  zoomOut() {
    this.zoom = Math.max(0.3, +(this.zoom - 0.1).toFixed(2));
  }

  resetZoom() {
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
  }
}
