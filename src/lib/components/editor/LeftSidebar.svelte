<script lang="ts">
  import Icon from "@iconify/svelte";

  import { getElementDepth, getOrderedLayerElements } from "./layer-tree-utils";
  import LayerItemRow from "./LayerItemRow.svelte";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let { editor }: { editor: EditorState } = $props();

  const DEFAULT_WIDTH = 256;
  const MIN_WIDTH = 180;
  const MAX_WIDTH = 520;

  let sidebarWidth = $state(DEFAULT_WIDTH);
  let isResizing = $state(false);
  let resizeStartX = 0;
  let resizeStartWidth = DEFAULT_WIDTH;

  let draggedLayerId = $state<string | null>(null);
  let dropTargetId = $state<string | null>(null);
  let dropPosition = $state<"before" | "after" | null>(null);
  let editingLayerId = $state<string | null>(null);
  let editingName = $state("");

  const orderedElements = $derived(getOrderedLayerElements(editor.elements));

  function startResize(e: MouseEvent) {
    e.preventDefault();
    isResizing = true;
    resizeStartX = e.clientX;
    resizeStartWidth = sidebarWidth;
  }

  function onWindowMouseMove(e: MouseEvent) {
    if (!isResizing) return;
    const nextWidth = resizeStartWidth + (e.clientX - resizeStartX);
    sidebarWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, nextWidth));
  }

  function onWindowMouseUp() {
    isResizing = false;
  }

  function startRenaming(el: CanvasElement, e?: MouseEvent) {
    if (el.isDefault || el.id === "flexbox-default") return;
    if (e) e.stopPropagation();
    editingLayerId = el.id;
    editingName = el.name;
  }

  function saveRename(id: string) {
    if (editingLayerId === id) {
      const trimmed = editingName.trim();
      if (trimmed.length > 0) {
        editor.updateElement(id, { name: trimmed });
        editor.commitUpdate();
      }
      editingLayerId = null;
      editingName = "";
    }
  }

  function cancelRename() {
    editingLayerId = null;
    editingName = "";
  }

  function onDragStart(e: DragEvent, el: CanvasElement) {
    if (el.isDefault || el.id === "flexbox-default" || editingLayerId) {
      e.preventDefault();
      return;
    }
    draggedLayerId = el.id;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", el.id);
    }
  }

  function onDragOver(e: DragEvent, target: CanvasElement) {
    if (!draggedLayerId || draggedLayerId === target.id) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let pos: "before" | "after" = e.clientY < rect.top + rect.height / 2 ? "before" : "after";
    if ((target.isDefault || target.id === "flexbox-default") && pos === "before") pos = "after";
    dropTargetId = target.id;
    dropPosition = pos;
  }

  function onDragLeave(e: DragEvent) {
    const target = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as Node | null;
    if (!related || !target.contains(related)) {
      dropTargetId = null;
      dropPosition = null;
    }
  }

  function onDrop(e: DragEvent, target: CanvasElement) {
    e.preventDefault();
    if (draggedLayerId && dropPosition && draggedLayerId !== target.id) {
      editor.reorderLayers(draggedLayerId, target.id, dropPosition);
    }
    draggedLayerId = null;
    dropTargetId = null;
    dropPosition = null;
  }

  function onDragEnd() {
    draggedLayerId = null;
    dropTargetId = null;
    dropPosition = null;
  }
</script>

<svelte:window onmousemove={onWindowMouseMove} onmouseup={onWindowMouseUp} />

<aside
  style="width: {sidebarWidth}px;"
  class="relative flex h-full shrink-0 flex-col border-r border-[#2c2c2c] bg-[#1e1e1e] text-xs text-neutral-300 {isResizing
    ? 'select-none'
    : ''}"
>
  <div
    class="flex h-10 items-center justify-between border-b border-[#2c2c2c] bg-[#222222] px-3 font-medium text-white select-none"
  >
    <div class="flex items-center gap-2">
      <Icon icon="lucide:layers" class="h-4 w-4 text-[#0d99ff]" />
      <span class="text-xs font-semibold">Layers</span>
    </div>
    <span class="rounded bg-[#2c2c2c] px-1.5 py-0.5 text-[10px] text-neutral-400">
      {editor.elements.length}
    </span>
  </div>

  <div class="flex-1 space-y-0.5 overflow-y-auto p-1.5">
    {#each orderedElements as element (element.id)}
      <LayerItemRow
        {editor}
        {element}
        depth={getElementDepth(editor.elements, element.id)}
        isEditing={editingLayerId === element.id}
        bind:editingName
        isBeingDragged={draggedLayerId === element.id}
        isDropTarget={dropTargetId === element.id}
        {dropPosition}
        onStartRename={startRenaming}
        onSaveRename={saveRename}
        onCancelRename={cancelRename}
        {onDragStart}
        {onDragOver}
        {onDragLeave}
        {onDrop}
        {onDragEnd}
      />
    {/each}

    {#if editor.elements.length === 0}
      <div class="p-6 text-center text-neutral-500">
        <p>Belum ada layer.</p>
        <p class="mt-1 text-[11px]">Pilih tool di atas untuk menambahkan elemen ke kanvas.</p>
      </div>
    {/if}
  </div>

  <!-- Resize Handle -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    role="separator"
    aria-orientation="vertical"
    aria-label="Ubah lebar sidebar layers"
    title="Geser untuk ubah lebar (klik 2x untuk reset)"
    onmousedown={startResize}
    ondblclick={() => (sidebarWidth = DEFAULT_WIDTH)}
    class="absolute top-0 right-0 z-20 h-full w-1.5 cursor-col-resize transition-colors hover:bg-[#0d99ff]/60 {isResizing
      ? 'bg-[#0d99ff]'
      : ''}"
  ></div>
</aside>
