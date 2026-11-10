<script lang="ts">
  import Icon from "@iconify/svelte";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let { editor }: { editor: EditorState } = $props();

  let isDragging = $state(false);
  let dragStartPos = $state({ x: 0, y: 0 });
  let elementStartPos = $state({ x: 0, y: 0 });

  let isResizing = $state(false);
  let resizeHandle = $state<string | null>(null);
  let initialBox = $state({ x: 0, y: 0, w: 0, h: 0 });

  let isCanvasPanning = $state(false);
  let isSpacePressed = $state(false);
  let panStart = $state({ x: 0, y: 0 });

  const isPanActive = $derived(editor.tool === "pan" || isSpacePressed);
  const canvasCursorClass = $derived(
    isCanvasPanning ? "cursor-grabbing" : isPanActive ? "cursor-grab" : "cursor-default"
  );

  let mouseClientPos = $state({ x: 0, y: 0 });
  let isMouseInsideCanvas = $state(false);

  const activeFollower = $derived.by(() => {
    if (isPanActive || isCanvasPanning || editor.isPreviewMode) return null;

    // 1. Saat mode penambahan elemen aktif (pendingElementType)
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
      return {
        type,
        label: labelMap[type] || type
      };
    }

    // 2. Saat elemen teks, tombol, youtube, dll sedang aktif/terpilih
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
        return {
          type,
          label: editor.selectedElement.name
        };
      }
    }

    return null;
  });

  function onCanvasMouseDown(e: MouseEvent) {
    // If clicking directly on canvas or spacebar/hand tool active
    if (isPanActive || e.button === 1) {
      isCanvasPanning = true;
      panStart = { x: e.clientX - editor.pan.x, y: e.clientY - editor.pan.y };
      return;
    }

    // Deselect if clicking on empty space of frame/canvas
    const target = e.target as HTMLElement;
    if (target.dataset.role === "canvas-background" || target.dataset.role === "artboard") {
      editor.selectElement(null);
    }
  }

  function onElementMouseDown(e: MouseEvent, el: CanvasElement) {
    if (isPanActive || e.button === 1) {
      onCanvasMouseDown(e);
      return;
    }

    // Jika dalam mode penambahan elemen ke dalam frame
    if (editor.pendingElementType) {
      e.stopPropagation();
      const targetFrameId = el.type === "frame" ? el.id : el.parentId || el.id;
      editor.addElementToFrame(targetFrameId, editor.pendingElementType, {
        flexDirection: editor.pendingFrameDirection
      });
      return;
    }

    if (el.locked || editor.isPreviewMode) return;
    e.stopPropagation();

    editor.selectElement(el.id);
    if (!el.parentId && !el.isDefault && el.id !== "flexbox-default") {
      isDragging = true;
      dragStartPos = { x: e.clientX, y: e.clientY };
      elementStartPos = { x: el.x, y: el.y };
    }
  }

  function onChildMouseDown(e: MouseEvent, child: CanvasElement) {
    if (isPanActive || e.button === 1) {
      onCanvasMouseDown(e);
      return;
    }

    if (editor.pendingElementType) {
      e.stopPropagation();
      const targetId = child.type === "frame" ? child.id : child.parentId;
      if (targetId) {
        editor.addElementToFrame(targetId, editor.pendingElementType, {
          flexDirection: editor.pendingFrameDirection
        });
      }
      return;
    }

    if (child.locked || editor.isPreviewMode) return;
    e.stopPropagation();
    editor.selectElement(child.id);
  }

  function onResizeMouseDown(e: MouseEvent, handle: string) {
    e.stopPropagation();
    if (!editor.selectedElement || editor.selectedElement.locked) return;

    isResizing = true;
    resizeHandle = handle;
    dragStartPos = { x: e.clientX, y: e.clientY };
    initialBox = {
      x: editor.selectedElement.x,
      y: editor.selectedElement.y,
      w: editor.selectedElement.width,
      h: editor.selectedElement.height
    };
  }

  function onMouseMove(e: MouseEvent) {
    mouseClientPos = { x: e.clientX, y: e.clientY };

    if (isCanvasPanning) {
      editor.pan = {
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      };
      return;
    }

    if (isDragging && editor.selectedElement) {
      const dx = (e.clientX - dragStartPos.x) / editor.zoom;
      const dy = (e.clientY - dragStartPos.y) / editor.zoom;

      editor.updateElement(editor.selectedElement.id, {
        x: Math.round(elementStartPos.x + dx),
        y: Math.round(elementStartPos.y + dy)
      });
      return;
    }

    if (isResizing && editor.selectedElement && resizeHandle) {
      const isDef =
        editor.selectedElement.isDefault || editor.selectedElement.id === "flexbox-default";
      if (isDef) {
        const dy = (e.clientY - dragStartPos.y) / editor.zoom;
        const newH = Math.max(80, Math.round(initialBox.h + dy));
        editor.updateElement(editor.selectedElement.id, {
          x: 0,
          y: 0,
          width: editor.frame.width,
          height: newH,
          heightMode: "fixed"
        });
        editor.frame.height = newH;
        return;
      }

      const dx = (e.clientX - dragStartPos.x) / editor.zoom;
      const dy = (e.clientY - dragStartPos.y) / editor.zoom;

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

      if (resizeHandle.includes("e") || resizeHandle.includes("w")) {
        updates.widthMode = "fixed";
      }
      if (resizeHandle.includes("n") || resizeHandle.includes("s")) {
        updates.heightMode = "fixed";
      }

      editor.updateElement(editor.selectedElement.id, updates);
    }
  }

  function onMouseUp() {
    if (isDragging || isResizing) {
      isDragging = false;
      isResizing = false;
      resizeHandle = null;
      editor.commitUpdate();
    }
    if (isCanvasPanning) {
      isCanvasPanning = false;
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (
      e.code === "Space" &&
      !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
    ) {
      isSpacePressed = true;
    }

    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (!e.metaKey && !e.ctrlKey && !e.altKey) {
      if (e.key === "v" || e.key === "V") {
        editor.tool = "select";
      } else if (e.key === "h" || e.key === "H") {
        editor.tool = "pan";
      }
    }

    if (editor.selectedElement) {
      const isDef =
        editor.selectedElement.isDefault || editor.selectedElement.id === "flexbox-default";
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        if (!isDef) {
          editor.deleteElement(editor.selectedElement.id);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        editor.duplicateElement(editor.selectedElement.id);
      } else if (e.key.startsWith("Arrow")) {
        if (!isDef) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          const current = editor.selectedElement;
          let { x, y } = current;
          if (e.key === "ArrowUp") y -= step;
          if (e.key === "ArrowDown") y += step;
          if (e.key === "ArrowLeft") x -= step;
          if (e.key === "ArrowRight") x += step;
          editor.updateElement(current.id, { x, y });
          editor.commitUpdate();
        }
      }
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "z") {
      e.preventDefault();
      if (e.shiftKey) {
        editor.redo();
      } else {
        editor.undo();
      }
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.code === "Space") {
      isSpacePressed = false;
    }
  }

  function gestureAction(node: HTMLElement) {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // 2-finger pinch on trackpad (macOS fires wheel with ctrlKey=true) or Cmd+scroll
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = Math.exp(-e.deltaY * 0.01);
        const nextZoom = Math.min(
          3.0,
          Math.max(0.15, Number((editor.zoom * zoomFactor).toFixed(2)))
        );
        editor.zoom = nextZoom;
      } else {
        // 2-finger swipe on trackpad to pan canvas
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
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialZoom = editor.zoom;
        initialPan = { ...editor.pan };
        initialCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        if (initialDistance > 0) {
          const scale = currentDistance / initialDistance;
          const nextZoom = Math.min(3.0, Math.max(0.15, Number((initialZoom * scale).toFixed(2))));
          editor.zoom = nextZoom;
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
  }
</script>

<svelte:window
  onmousemove={onMouseMove}
  onmouseup={onMouseUp}
  onkeydown={onKeyDown}
  onkeyup={onKeyUp}
/>

<!-- Canvas Viewport -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  use:gestureAction
  role="region"
  aria-label="Design Canvas"
  data-role="canvas-background"
  onmouseenter={() => (isMouseInsideCanvas = true)}
  onmouseleave={() => (isMouseInsideCanvas = false)}
  onmousedown={onCanvasMouseDown}
  class="relative flex-1 overflow-hidden bg-[#141414] select-none {canvasCursorClass}"
  style="background-image: radial-gradient(#2d2d2d 1px, transparent 1px); background-size: 20px 20px; cursor: {isCanvasPanning
    ? 'grabbing'
    : isPanActive
      ? 'grab'
      : 'default'};"
>
  <!-- Floating Cursor Icon Follower (saat aktif di teks, tombol, youtube, dll) -->
  {#if activeFollower && isMouseInsideCanvas && !isPanActive && !isCanvasPanning && !editor.isPreviewMode}
    <div
      class="pointer-events-none fixed z-50 flex items-center gap-1.5 rounded-full border border-[#0d99ff]/50 bg-[#16161a]/95 px-2.5 py-1 text-[11px] font-medium text-white shadow-2xl backdrop-blur-md select-none"
      style="left: {mouseClientPos.x + 14}px; top: {mouseClientPos.y + 14}px;"
    >
      {#if activeFollower.type === "heading"}
        <Icon icon="lucide:heading" class="h-3.5 w-3.5 text-[#0d99ff]" />
      {:else if activeFollower.type === "text"}
        <Icon icon="lucide:type" class="h-3.5 w-3.5 text-[#0d99ff]" />
      {:else if activeFollower.type === "button"}
        <Icon icon="lucide:rectangle-horizontal" class="h-3.5 w-3.5 text-[#0d99ff]" />
      {:else if activeFollower.type === "link"}
        <Icon icon="lucide:link-2" class="h-3.5 w-3.5 text-[#0d99ff]" />
      {:else if activeFollower.type === "image"}
        <Icon icon="lucide:image" class="h-3.5 w-3.5 text-[#0d99ff]" />
      {:else if activeFollower.type === "icon"}
        <Icon icon="lucide:smile" class="h-3.5 w-3.5 text-[#0d99ff]" />
      {:else if activeFollower.type === "frame"}
        <Icon icon="lucide:columns-2" class="h-3.5 w-3.5 text-[#0d99ff]" />
      {:else if activeFollower.type === "youtube"}
        <svg
          class="h-3.5 w-3.5 shrink-0 fill-red-500"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
          />
        </svg>
      {/if}
      <span class="max-w-30 truncate text-xs">{activeFollower.label}</span>
    </div>
  {/if}
  <!-- Visitor Preview Mode Header Indicator -->
  {#if editor.isPreviewMode}
    <div
      class="absolute top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-neutral-700 bg-neutral-900/90 px-4 py-2 text-xs text-white shadow-2xl backdrop-blur"
    >
      <span class="flex items-center gap-1.5 font-medium text-amber-400">
        <Icon icon="lucide:eye" class="h-3.5 w-3.5" />
        Mode Pratinjau Pengunjung
      </span>
      <button
        onclick={() => (editor.isPreviewMode = false)}
        class="rounded-full bg-[#0d99ff] px-3 py-1 font-semibold text-white shadow transition hover:brightness-110"
      >
        Kembali ke Desain
      </button>
    </div>
  {/if}

  <!-- Pending Add Element Helper Banner -->
  {#if editor.pendingElementType}
    {@const typeLabels: Record<string, string> = {
			heading: 'Judul (Heading)',
			text: 'Paragraf Teks',
			button: 'Tombol',
			link: 'Tautan (Link)',
			image: 'Gambar',
			icon: 'Ikon',
			frame: 'Flexbox',
			youtube: 'Iframe YouTube'
		}}
    <div
      class="absolute top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#0d99ff]/50 bg-[#141b2b]/95 px-4 py-2 text-xs text-white shadow-2xl backdrop-blur select-none"
    >
      <span class="flex items-center gap-2 font-medium text-[#0d99ff]">
        <span class="relative flex h-2.5 w-2.5">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0d99ff] opacity-75"
          ></span>
          <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0d99ff]"></span>
        </span>
        <span>
          Klik pada Container untuk memasukkan {typeLabels[editor.pendingElementType] ||
            editor.pendingElementType}
        </span>
      </span>
      <button
        onclick={() => (editor.pendingElementType = null)}
        class="rounded-full bg-neutral-800 px-2.5 py-1 text-[11px] font-semibold text-neutral-300 transition hover:bg-neutral-700 hover:text-white"
      >
        Batal (Esc)
      </button>
    </div>
  {/if}
  <!-- Artboard Container with Pan & Zoom -->
  <div
    class="absolute top-1/2 left-1/2 origin-center transition-transform duration-75 ease-out"
    style="transform: translate(calc(-50% + {editor.pan.x}px), calc(-50% + {editor.pan
      .y}px)) scale({editor.zoom});"
  >
    <!-- Artboard Frame Label -->
    <div class="absolute -top-7 left-0 flex items-center gap-2">
      <span class="text-xs font-semibold text-neutral-400">{editor.frame.name}</span>
      <span class="rounded bg-[#222] px-1.5 py-0.5 text-[10px] text-neutral-400">
        {editor.frame.width} × {editor.frame.height}
      </span>
    </div>

    <!-- Artboard Surface -->
    <div
      data-role="artboard"
      class="relative shadow-2xl transition-all"
      style="
				width: {editor.frame.width}px;
				height: {editor.frame.height}px;
				background-color: {editor.frame.background};
				border-radius: 4px;
				box-shadow: 0 0 0 1px #222, 0 30px 60px -12px rgba(0,0,0,0.7);
				cursor: {isCanvasPanning ? 'grabbing' : isPanActive ? 'grab' : 'default'};
			"
    >
      {#snippet renderChildElement(child: CanvasElement)}
        {@const isChildSelected = editor.selectedId === child.id}
        {@const subChildren =
          child.type === "frame" ? editor.elements.filter((c) => c.parentId === child.id) : []}
        {@const widthMode = child.widthMode || "fixed"}
        {@const heightMode = child.heightMode || "fixed"}
        {@const wText =
          widthMode === "fill" ? "Penuh" : widthMode === "hug" ? "Ikuti" : `${child.width}px`}
        {@const hText =
          heightMode === "fill" ? "Penuh" : heightMode === "hug" ? "Ikuti" : `${child.height}px`}
        <div
          role="button"
          tabindex="0"
          onmousedown={(e) => onChildMouseDown(e, child)}
          class="relative {widthMode === 'fill'
            ? 'w-full min-w-0 flex-1'
            : widthMode === 'hug'
              ? 'w-auto shrink-0'
              : 'shrink-0'} {heightMode === 'fill'
            ? 'h-full min-h-0 self-stretch'
            : heightMode === 'hug'
              ? 'h-auto'
              : ''} {isChildSelected ? 'z-20' : ''}"
          style="
						{widthMode === 'fixed'
            ? `width: ${child.width}px;`
            : widthMode === 'hug'
              ? `min-width: fit-content; max-width: 100%;`
              : `width: 100%; min-width: 0;`}
						{heightMode === 'fixed'
            ? `height: ${child.height}px; min-height: ${child.height}px;`
            : heightMode === 'hug'
              ? `height: auto; min-height: fit-content;`
              : `height: 100%; min-height: 0; align-self: stretch;`}
						background-color: {child.fill};
						border-radius: {child.borderRadius}px;
						border-width: {child.borderWidth}px;
						border-color: {child.borderColor};
						border-style: {child.borderStyle};
						opacity: {child.opacity / 100};
						box-shadow: {child.boxShadow};
						color: {child.color || 'inherit'};
						font-size: {child.fontSize ? child.fontSize + 'px' : 'inherit'};
						font-weight: {child.fontWeight || 'normal'};
						font-family: {child.fontFamily || 'Inter'};
						text-align: {child.textAlign || 'left'};
						cursor: {isCanvasPanning
            ? 'grabbing'
            : isPanActive
              ? 'grab'
              : editor.isPreviewMode
                ? 'default'
                : child.locked
                  ? 'not-allowed'
                  : (child.type === 'heading' || child.type === 'text') && isChildSelected
                    ? 'text'
                    : 'pointer'};
					"
        >
          {#if child.type === "heading"}
            <h2
              class="flex h-full w-full items-center p-1 leading-tight tracking-tight {isChildSelected
                ? 'cursor-text select-text'
                : 'select-none'}"
            >
              {child.content}
            </h2>
          {:else if child.type === "text"}
            <p
              class="h-full w-full p-1 leading-relaxed {isChildSelected
                ? 'cursor-text select-text'
                : 'select-none'}"
            >
              {child.content}
            </p>
          {:else if child.type === "button"}
            <div
              class="flex h-full w-full items-center justify-center px-4 py-2 font-semibold select-none"
            >
              {child.content}
            </div>
          {:else if child.type === "link"}
            <span
              class="flex h-full w-full items-center p-1 underline-offset-4 select-none hover:underline"
            >
              {child.content}
            </span>
          {:else if child.type === "image"}
            <img
              src={child.src ||
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80"}
              alt={child.alt || child.name}
              class="pointer-events-none h-full w-full object-cover select-none"
              style="border-radius: inherit;"
            />
          {:else if child.type === "icon"}
            <div
              class="flex h-full w-full items-center justify-center p-0.5 select-none"
              style="color: {child.color || '#0d99ff'};"
            >
              <Icon
                icon={child.icon || child.content || "lucide:smile"}
                class="h-full max-h-full w-full max-w-full"
              />
            </div>
          {:else if child.type === "frame"}
            <!-- Nested Flexbox Frame Renderer -->
            <div
              class="flex h-full w-full overflow-auto {child.flexDirection === 'column'
                ? 'flex-col'
                : 'flex-row'} {subChildren.length === 0
                ? 'items-center justify-center'
                : child.justifyContent === 'center'
                  ? 'items-center justify-center'
                  : 'items-center justify-start'}"
              style="
								gap: {child.gap ?? 12}px;
								padding: {child.padding ?? 16}px;
								flex-wrap: wrap;
							"
            >
              {#if subChildren.length === 0}
                <div
                  class="flex h-full min-h-22.5 w-full flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center transition-all select-none {editor.pendingElementType
                    ? 'border-[#0d99ff] bg-[#0d99ff]/10 ring-2 ring-[#0d99ff]/30'
                    : 'border-neutral-300 bg-neutral-50/60'}"
                >
                  <span class="font-mono text-xs font-semibold text-neutral-600">
                    {child.name} Kosong
                  </span>
                  <p class="mt-1 text-[10px] text-neutral-500">
                    {#if editor.pendingElementType}
                      <strong class="text-[#0d99ff]"
                        >Klik di sini untuk memasukkan ke dalam {child.name}!</strong
                      >
                    {:else}
                      Klik untuk memilih atau isi komponen di sini.
                    {/if}
                  </p>
                </div>
              {:else}
                {#each subChildren as subChild (subChild.id)}
                  {@render renderChildElement(subChild)}
                {/each}
              {/if}
            </div>
          {:else if child.type === "youtube"}
            <div class="relative h-full w-full overflow-hidden rounded bg-black">
              <iframe
                title={child.name}
                src={child.src || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                class="pointer-events-none h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          {/if}

          {#if isChildSelected && !editor.isPreviewMode}
            <!-- Active / Focused Border Ring (Thin Line) -->
            <div
              class="pointer-events-none absolute -inset-px z-30 border border-[#0d99ff]"
              style="border-radius: {Math.max(0, (child.borderRadius || 0) + 1)}px;"
            ></div>

            <!-- Nama Komponen di ATAS -->
            <div
              class="pointer-events-none absolute -top-5 left-1/2 z-40 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 font-mono text-[9px] font-medium whitespace-nowrap text-white shadow"
            >
              {child.name}
            </div>

            <!-- Dimensi Komponen di BAWAH -->
            <div
              class="pointer-events-none absolute -bottom-5 left-1/2 z-40 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 font-mono text-[9px] font-medium whitespace-nowrap text-white shadow"
            >
              {wText} × {hText}
            </div>
          {/if}
        </div>
      {/snippet}

      <!-- Elements Render Loop (Root Elements) -->
      {#each editor.elements.filter((el) => !el.parentId) as el (el.id)}
        {#if !el.hidden}
          {@const isSelected = editor.selectedId === el.id}
          {@const isDefaultFrame = el.isDefault || el.id === "flexbox-default"}
          {@const currentX = isDefaultFrame ? 0 : el.x}
          {@const currentY = isDefaultFrame ? 0 : el.y}
          {@const widthMode = isDefaultFrame ? "fill" : el.widthMode || "fixed"}
          {@const heightMode = el.heightMode || "fixed"}
          {@const currentWidth =
            isDefaultFrame || widthMode === "fill" ? editor.frame.width : el.width}
          {@const rootWText = isDefaultFrame
            ? `${editor.frame.width}px`
            : widthMode === "fill"
              ? "Penuh"
              : widthMode === "hug"
                ? "Ikuti"
                : `${el.width}px`}
          {@const rootHText =
            heightMode === "fill" ? "Penuh" : heightMode === "hug" ? "Ikuti" : `${el.height}px`}

          <!-- Element Wrapper -->
          <div
            role="button"
            tabindex="0"
            onmousedown={(e) => onElementMouseDown(e, el)}
            class="absolute {isSelected ? 'z-40' : ''}"
            style="
							left: {currentX}px;
							top: {currentY}px;
							width: {widthMode === 'hug' ? 'auto' : `${currentWidth}px`};
							min-width: {widthMode === 'hug' ? 'fit-content' : undefined};
							height: {heightMode === 'hug' ? 'auto' : `${el.height}px`};
							min-height: {heightMode === 'hug' ? 'fit-content' : undefined};
							cursor: {isCanvasPanning
              ? 'grabbing'
              : isPanActive
                ? 'grab'
                : editor.isPreviewMode
                  ? 'default'
                  : el.locked
                    ? 'not-allowed'
                    : isDefaultFrame
                      ? 'default'
                      : (el.type === 'heading' || el.type === 'text') && isSelected
                        ? 'text'
                        : 'move'};
						"
          >
            <!-- Element Visual Rendering -->
            <div
              class="h-full w-full overflow-hidden"
              style="
								background-color: {el.fill};
								border-radius: {el.borderRadius}px;
								border-width: {el.borderWidth}px;
								border-color: {el.borderColor};
								border-style: {el.borderStyle};
								opacity: {el.opacity / 100};
								box-shadow: {el.boxShadow};
								transform: rotate({el.rotation}deg);
								color: {el.color || 'inherit'};
								font-size: {el.fontSize ? el.fontSize + 'px' : 'inherit'};
								font-weight: {el.fontWeight || 'normal'};
								font-family: {el.fontFamily || 'Inter'};
								text-align: {el.textAlign || 'left'};
							"
            >
              {#if el.type === "heading"}
                <h2
                  class="flex h-full w-full items-center leading-tight tracking-tight {isSelected
                    ? 'cursor-text select-text'
                    : 'select-none'}"
                >
                  {el.content}
                </h2>
              {:else if el.type === "text"}
                <p
                  class="h-full w-full leading-relaxed {isSelected
                    ? 'cursor-text select-text'
                    : 'select-none'}"
                >
                  {el.content}
                </p>
              {:else if el.type === "button"}
                <div
                  class="flex h-full w-full items-center justify-center font-semibold select-none"
                >
                  {el.content}
                </div>
              {:else if el.type === "badge"}
                <div
                  class="flex h-full w-full items-center justify-center font-semibold select-none"
                >
                  {el.content}
                </div>
              {:else if el.type === "image"}
                <img
                  src={el.src}
                  alt={el.alt || el.name}
                  class="pointer-events-none h-full w-full object-cover select-none"
                />
              {:else if el.type === "icon"}
                <div
                  class="pointer-events-none flex h-full w-full items-center justify-center p-0.5 select-none"
                  style="color: {el.color || '#0d99ff'};"
                >
                  <Icon
                    icon={el.icon || el.content || "lucide:smile"}
                    class="h-full max-h-full w-full max-w-full"
                  />
                </div>
              {:else if el.type === "link"}
                <span
                  class="pointer-events-none flex h-full w-full items-center underline-offset-4 select-none hover:underline"
                >
                  {el.content}
                </span>
              {:else if el.type === "youtube"}
                <div class="relative h-full w-full overflow-hidden bg-black">
                  <iframe
                    title={el.name}
                    src={el.src || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                    class="pointer-events-none h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              {:else if el.type === "frame"}
                {@const children = editor.elements.filter((c) => c.parentId === el.id)}
                <div
                  class="flex h-full w-full overflow-auto {el.flexDirection === 'column'
                    ? 'flex-col'
                    : 'flex-row'} {children.length === 0
                    ? 'items-center justify-center'
                    : el.justifyContent === 'center'
                      ? 'items-center justify-center'
                      : 'items-center justify-start'}"
                  style="
										gap: {el.gap ?? 16}px;
										padding: {el.padding ?? 24}px;
										flex-wrap: wrap;
									"
                >
                  {#if children.length === 0}
                    <div
                      class="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all select-none {editor.pendingElementType
                        ? 'border-[#0d99ff] bg-[#0d99ff]/10 ring-2 ring-[#0d99ff]/30'
                        : 'border-neutral-300 bg-neutral-50/60'}"
                    >
                      <span class="font-mono text-xs font-semibold text-neutral-700">
                        {el.name} Kosong
                      </span>
                      <p class="mt-1 text-[11px] text-neutral-500">
                        {#if editor.pendingElementType}
                          <strong class="text-[#0d99ff]"
                            >Klik di sini untuk memasukkan elemen ke dalam {el.name}!</strong
                          >
                        {:else}
                          Pilih Flexbox, Teks, Tombol, Tautan, Gambar, atau YouTube di toolbar
                          bawah, lalu klik di sini.
                        {/if}
                      </p>
                    </div>
                  {:else}
                    {#each children as child (child.id)}
                      {@render renderChildElement(child)}
                    {/each}
                  {/if}
                </div>
              {:else}
                <!-- Container / Frame / Rectangle -->
                <div class="h-full w-full"></div>
              {/if}
            </div>

            <!-- Interactive Bounding Box & Resize Handles (when selected) -->
            {#if isSelected && !el.locked && !editor.isPreviewMode && !isPanActive}
              <div
                class="pointer-events-none absolute -inset-px z-30 border border-[#0d99ff]"
                style="border-radius: {Math.max(0, (el.borderRadius || 0) + 1)}px;"
              >
                <!-- Nama Komponen di ATAS -->
                <div
                  class="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap text-white shadow-md"
                >
                  {el.name}
                </div>

                <!-- Dimensi Komponen di BAWAH -->
                <div
                  class="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap text-white shadow-md"
                >
                  {rootWText} × {rootHText}
                </div>
              </div>

              {#if isDefaultFrame}
                <!-- Hanya Handle Bawah untuk Flexbox Bawaan (lebar & posisi atas terkunci) -->
                <div
                  role="slider"
                  aria-label="Bottom Center resize handle"
                  aria-valuenow={el.height}
                  tabindex="0"
                  onmousedown={(e) => onResizeMouseDown(e, "s")}
                  class="pointer-events-auto absolute -bottom-2 left-1/2 z-50 flex h-3.5 w-12 -translate-x-1/2 cursor-ns-resize items-center justify-center rounded border border-[#0d99ff] bg-white shadow-lg"
                  title="Tarik untuk mengubah tinggi flexbox bawaan"
                >
                  <div class="h-0.5 w-4 rounded bg-[#0d99ff]"></div>
                </div>
              {:else}
                <!-- 8 Interactive Resize Handles -->
                <div
                  role="slider"
                  aria-label="Top Left resize handle"
                  aria-valuenow={el.width}
                  tabindex="0"
                  onmousedown={(e) => onResizeMouseDown(e, "nw")}
                  class="pointer-events-auto absolute -top-1.5 -left-1.5 z-50 h-3 w-3 cursor-nwse-resize rounded-xs border border-[#0d99ff] bg-white shadow"
                ></div>
                <div
                  role="slider"
                  aria-label="Top Center resize handle"
                  aria-valuenow={el.height}
                  tabindex="0"
                  onmousedown={(e) => onResizeMouseDown(e, "n")}
                  class="pointer-events-auto absolute -top-1.5 left-1/2 z-50 h-3 w-3 -translate-x-1/2 cursor-ns-resize rounded-xs border border-[#0d99ff] bg-white shadow"
                ></div>
                <div
                  role="slider"
                  aria-label="Top Right resize handle"
                  aria-valuenow={el.width}
                  tabindex="0"
                  onmousedown={(e) => onResizeMouseDown(e, "ne")}
                  class="pointer-events-auto absolute -top-1.5 -right-1.5 z-50 h-3 w-3 cursor-nesw-resize rounded-xs border border-[#0d99ff] bg-white shadow"
                ></div>
                <div
                  role="slider"
                  aria-label="Middle Right resize handle"
                  aria-valuenow={el.width}
                  tabindex="0"
                  onmousedown={(e) => onResizeMouseDown(e, "e")}
                  class="pointer-events-auto absolute top-1/2 -right-1.5 z-50 h-3 w-3 -translate-y-1/2 cursor-ew-resize rounded-xs border border-[#0d99ff] bg-white shadow"
                ></div>
                <div
                  role="slider"
                  aria-label="Bottom Right resize handle"
                  aria-valuenow={el.width}
                  tabindex="0"
                  onmousedown={(e) => onResizeMouseDown(e, "se")}
                  class="pointer-events-auto absolute -right-1.5 -bottom-1.5 z-50 h-3 w-3 cursor-nwse-resize rounded-xs border border-[#0d99ff] bg-white shadow"
                ></div>
                <div
                  role="slider"
                  aria-label="Bottom Center resize handle"
                  aria-valuenow={el.height}
                  tabindex="0"
                  onmousedown={(e) => onResizeMouseDown(e, "s")}
                  class="pointer-events-auto absolute -bottom-1.5 left-1/2 z-50 h-3 w-3 -translate-x-1/2 cursor-ns-resize rounded-xs border border-[#0d99ff] bg-white shadow"
                ></div>
                <div
                  role="slider"
                  aria-label="Bottom Left resize handle"
                  aria-valuenow={el.width}
                  tabindex="0"
                  onmousedown={(e) => onResizeMouseDown(e, "sw")}
                  class="pointer-events-auto absolute -bottom-1.5 -left-1.5 z-50 h-3 w-3 cursor-nesw-resize rounded-xs border border-[#0d99ff] bg-white shadow"
                ></div>
                <div
                  role="slider"
                  aria-label="Middle Left resize handle"
                  aria-valuenow={el.width}
                  tabindex="0"
                  onmousedown={(e) => onResizeMouseDown(e, "w")}
                  class="pointer-events-auto absolute top-1/2 -left-1.5 z-50 h-3 w-3 -translate-y-1/2 cursor-ew-resize rounded-xs border border-[#0d99ff] bg-white shadow"
                ></div>
              {/if}
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Floating Canvas Helper / Quick Navigation -->
  {#if !editor.isPreviewMode}
    <div
      class="absolute top-3 left-3 z-30 flex items-center gap-2 rounded-lg border border-[#2c2c2c] bg-[#1e1e1e]/90 px-3 py-1.5 text-xs text-neutral-400 shadow-xl backdrop-blur select-none"
    >
      <span class="text-neutral-300">2 Jari Trackpad: Pinch Zoom & Geser</span>
      <span class="text-neutral-600">•</span>
      <span>Space + Drag: Pan</span>
      <span class="text-neutral-600">•</span>
      <span>Del: Hapus</span>
      <span class="text-neutral-600">•</span>
      <span>Ctrl+D: Duplikat</span>
      <span class="text-neutral-600">•</span>
      <span>Panah: Geser Halus</span>
    </div>
  {/if}
</div>
