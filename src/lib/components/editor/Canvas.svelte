<script lang="ts">
  import { untrack } from "svelte";

  import { createGestureAction, getActiveFollower } from "./canvas-gesture";
  import {
    applyDragMove,
    applyResizeMove,
    handleCanvasShortcuts,
    handlePendingElementInsert
  } from "./canvas-interactions";
  import { getCanvasFrameMetrics, isEditableTextElement } from "./canvas-view-utils";
  import CanvasOverlays from "./CanvasOverlays.svelte";
  import CanvasRootItem from "./CanvasRootItem.svelte";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let { editor }: { editor: EditorState } = $props();

  let isDragging = $state(false);
  let isResizing = $state(false);
  let isCanvasPanning = $state(false);
  let isSpacePressed = $state(false);
  let isMouseInsideCanvas = $state(false);
  let dragStartPos = $state({ x: 0, y: 0 });
  let elementStartPos = $state({ x: 0, y: 0 });
  let panStart = $state({ x: 0, y: 0 });
  let mouseClientPos = $state({ x: 0, y: 0 });
  let initialBox = $state({ x: 0, y: 0, w: 0, h: 0 });
  let resizeHandle = $state<string | null>(null);
  let hoveredElementId = $state<string | null>(null);
  let editingElementId = $state<string | null>(null);
  let editClickPos = $state<{ x: number; y: number } | null>(null);
  let defaultFrameHeight = $state(0);

  const isPanActive = $derived(editor.tool === "pan" || isSpacePressed);
  const canvasCursorClass = $derived(
    isCanvasPanning ? "cursor-grabbing" : isPanActive ? "cursor-grab" : "cursor-default"
  );
  const metrics = $derived(getCanvasFrameMetrics(editor, defaultFrameHeight));
  const defaultFrameEl = $derived(metrics.defaultFrameEl);
  const activePresetMinHeight = $derived(metrics.activePresetMinHeight);
  const autoCanvasHeight = $derived(metrics.autoCanvasHeight);

  $effect(() => {
    const h = autoCanvasHeight;
    untrack(() => {
      if (editor.frame.height !== h) editor.frame.height = h;
    });
  });

  const activeFollower = $derived(getActiveFollower(editor, isPanActive, isCanvasPanning));
  const gestureAction = $derived(createGestureAction(editor));

  function onCanvasMouseDown(e: MouseEvent) {
    if (isPanActive || e.button === 1) {
      isCanvasPanning = true;
      panStart = { x: e.clientX - editor.pan.x, y: e.clientY - editor.pan.y };
      return;
    }
    if (handlePendingElementInsert(e, editor)) return;
    const role = (e.target as HTMLElement).dataset.role;
    if (role === "canvas-background" || role === "artboard") editor.selectElement(null);
  }

  function onStartEdit(el: CanvasElement, e?: MouseEvent) {
    if (editingElementId === el.id || !isEditableTextElement(el, editor.isPreviewMode)) return;
    editor.selectElement(el.id);
    editClickPos = e ? { x: e.clientX, y: e.clientY } : null;
    editingElementId = el.id;
  }

  function onItemMouseDown(e: MouseEvent, item: CanvasElement, isRoot: boolean) {
    if (isPanActive || e.button === 1) return onCanvasMouseDown(e);
    if (editingElementId === item.id) return e.stopPropagation();
    if (handlePendingElementInsert(e, editor, item) || item.locked || editor.isPreviewMode) return;
    e.stopPropagation();
    if (
      !isRoot &&
      editor.selectedId === item.id &&
      isEditableTextElement(item, editor.isPreviewMode)
    ) {
      e.preventDefault();
      onStartEdit(item, e);
      return;
    }
    editingElementId = null;
    editor.selectElement(item.id);
    if (isRoot && !item.parentId && !item.isDefault && item.id !== "flexbox-default") {
      isDragging = true;
      dragStartPos = { x: e.clientX, y: e.clientY };
      elementStartPos = { x: item.x, y: item.y };
    }
  }

  function onResizeMouseDown(e: MouseEvent, handle: string) {
    e.stopPropagation();
    if (!editor.selectedElement || editor.selectedElement.locked) return;
    isResizing = true;
    resizeHandle = handle;
    dragStartPos = { x: e.clientX, y: e.clientY };
    const s = editor.selectedElement;
    initialBox = { x: s.x, y: s.y, w: s.width, h: s.height };
  }

  function onMouseMove(e: MouseEvent) {
    mouseClientPos = { x: e.clientX, y: e.clientY };
    if (isCanvasPanning) editor.pan = { x: e.clientX - panStart.x, y: e.clientY - panStart.y };
    else if (isDragging) applyDragMove(editor, elementStartPos, dragStartPos, e.clientX, e.clientY);
    else if (isResizing && resizeHandle)
      applyResizeMove(editor, resizeHandle, initialBox, dragStartPos, e, activePresetMinHeight);
  }

  function onMouseUp() {
    if (isDragging || isResizing) {
      isDragging = false;
      isResizing = false;
      resizeHandle = null;
      editor.commitUpdate();
    }
    isCanvasPanning = false;
  }
</script>

<svelte:window
  onmousemove={onMouseMove}
  onmouseup={onMouseUp}
  onkeydown={(e) => handleCanvasShortcuts(e, editor, (val) => (isSpacePressed = val))}
  onkeyup={(e) => e.code === "Space" && (isSpacePressed = false)}
/>

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
  style="background-image: radial-gradient(#2d2d2d 1px, transparent 1px); background-size: 20px 20px;"
>
  <CanvasOverlays
    {editor}
    {activeFollower}
    {isMouseInsideCanvas}
    {isPanActive}
    {isCanvasPanning}
    {mouseClientPos}
  />

  <div
    class="absolute top-1/2 left-1/2 origin-center transition-transform duration-75 ease-out"
    style="transform: translate(calc(-50% + {editor.pan.x}px), calc(-50% + {editor.pan
      .y}px)) scale({editor.zoom});"
  >
    <div class="absolute -top-7 left-0 flex items-center gap-2">
      <span class="text-xs font-semibold text-neutral-400">{editor.frame.name}</span>
      <span class="rounded bg-[#222] px-1.5 py-0.5 text-[10px] text-neutral-400">
        {editor.frame.width} × {autoCanvasHeight}
      </span>
    </div>

    <div
      data-role="artboard"
      class="relative overflow-x-hidden transition-all"
      style="width: {editor.frame
        .width}px; min-height: {activePresetMinHeight}px; height: {autoCanvasHeight}px; background-color: {editor
        .frame.background}; border-radius: 4px; border: 1px solid #2c2c2c;"
    >
      {#each editor.resolvedElements.filter((el) => !el.parentId && !el.hidden) as el (el.id)}
        <CanvasRootItem
          {editor}
          {el}
          isDefaultFrame={Boolean(el.isDefault || defaultFrameEl?.id === el.id)}
          {activePresetMinHeight}
          {hoveredElementId}
          {editingElementId}
          {editClickPos}
          {isPanActive}
          {isCanvasPanning}
          bind:defaultFrameHeight
          onHover={(id) => (hoveredElementId = id)}
          onElementMouseDown={(e, item) => onItemMouseDown(e, item, true)}
          onChildMouseDown={(e, item) => onItemMouseDown(e, item, false)}
          {onResizeMouseDown}
          {onStartEdit}
          onStopEdit={() => (editingElementId = null)}
        />
      {/each}
    </div>
  </div>
</div>
