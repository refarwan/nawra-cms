<script lang="ts">
  import CanvasRootItem from "./CanvasRootItem.svelte";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let {
    editor,
    autoCanvasHeight,
    activePresetMinHeight,
    defaultFrameEl,
    hoveredElementId,
    editingElementId,
    editClickPos,
    isPanActive,
    isCanvasPanning,
    defaultFrameHeight = $bindable(0),
    onHover,
    onElementMouseDown,
    onChildMouseDown,
    onResizeMouseDown,
    onStartEdit,
    onStopEdit
  }: {
    editor: EditorState;
    autoCanvasHeight: number;
    activePresetMinHeight: number;
    defaultFrameEl: CanvasElement | undefined;
    hoveredElementId: string | null;
    editingElementId: string | null;
    editClickPos: { x: number; y: number } | null;
    isPanActive: boolean;
    isCanvasPanning: boolean;
    defaultFrameHeight: number;
    onHover: (id: string | null) => void;
    onElementMouseDown: (e: MouseEvent, item: CanvasElement) => void;
    onChildMouseDown: (e: MouseEvent, item: CanvasElement) => void;
    onResizeMouseDown: (e: MouseEvent, handle: string) => void;
    onStartEdit: (el: CanvasElement, e?: MouseEvent) => void;
    onStopEdit: () => void;
  } = $props();
</script>

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
        {onHover}
        {onElementMouseDown}
        {onChildMouseDown}
        {onResizeMouseDown}
        {onStartEdit}
        {onStopEdit}
      />
    {/each}
  </div>
</div>
