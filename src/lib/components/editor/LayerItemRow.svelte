<script lang="ts">
  import Icon from "@iconify/svelte";

  import { getLayerTypeIcon } from "./layer-tree-utils";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let {
    editor,
    element,
    depth,
    isEditing,
    editingName = $bindable(""),
    isBeingDragged,
    isDropTarget,
    dropPosition,
    onStartRename,
    onSaveRename,
    onCancelRename,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd
  }: {
    editor: EditorState;
    element: CanvasElement;
    depth: number;
    isEditing: boolean;
    editingName: string;
    isBeingDragged: boolean;
    isDropTarget: boolean;
    dropPosition: "before" | "after" | null;
    onStartRename: (el: CanvasElement, e?: MouseEvent) => void;
    onSaveRename: (id: string) => void;
    onCancelRename: () => void;
    onDragStart: (e: DragEvent, el: CanvasElement) => void;
    onDragOver: (e: DragEvent, target: CanvasElement) => void;
    onDragLeave: (e: DragEvent) => void;
    onDrop: (e: DragEvent, target: CanvasElement) => void;
    onDragEnd: () => void;
  } = $props();

  const iconName = $derived(getLayerTypeIcon(element.type));
  const isSelected = $derived(editor.selectedId === element.id);
  const isDefault = $derived(Boolean(element.isDefault || element.id === "flexbox-default"));
  const isDraggable = $derived(!isDefault && !isEditing);

  function autoFocus(node: HTMLInputElement) {
    node.focus();
    node.select();
  }
</script>

<div
  role="button"
  tabindex="0"
  draggable={isDraggable}
  ondragstart={(e) => onDragStart(e, element)}
  ondragover={(e) => onDragOver(e, element)}
  ondragleave={onDragLeave}
  ondrop={(e) => onDrop(e, element)}
  ondragend={onDragEnd}
  ondblclick={(e) => onStartRename(element, e)}
  onclick={() => editor.selectElement(element.id)}
  onkeydown={(e) => e.key === "Enter" && editor.selectElement(element.id)}
  style="margin-left: {depth > 0 ? depth * 14 : 0}px;"
  class="group relative flex items-center justify-between rounded px-2 py-1.5 transition select-none {depth >
  0
    ? 'border-l-2 border-[#0d99ff]/50 pl-2'
    : ''} {isSelected
    ? 'bg-[#0d99ff] font-medium text-white'
    : 'text-neutral-300 hover:bg-[#2c2c2c]'} {isBeingDragged
    ? 'scale-[0.98] opacity-30 ring-1 ring-neutral-500'
    : ''} {isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} {isDropTarget &&
  dropPosition === 'before'
    ? 'border-t-2 border-[#0d99ff] bg-[#0d99ff]/15'
    : ''} {isDropTarget && dropPosition === 'after'
    ? 'border-b-2 border-[#0d99ff] bg-[#0d99ff]/15'
    : ''}"
>
  <div
    class="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden {isSelected
      ? 'mr-2'
      : 'group-hover:mr-2'}"
  >
    {#if isDraggable}
      <Icon
        icon="lucide:grip-vertical"
        class="h-3 w-3 shrink-0 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 {isSelected
          ? 'text-white/70'
          : ''}"
      />
    {/if}
    <Icon
      icon={iconName}
      class="h-3.5 w-3.5 shrink-0 {isSelected ? 'text-white' : 'text-neutral-400'}"
    />

    {#if isEditing}
      <input
        use:autoFocus
        type="text"
        bind:value={editingName}
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") onSaveRename(element.id);
          if (e.key === "Escape") onCancelRename();
        }}
        onblur={() => onSaveRename(element.id)}
        class="h-5.5 w-full rounded border border-white bg-[#141414] px-1.5 text-xs font-medium text-white ring-1 ring-[#0d99ff] outline-none"
      />
    {:else}
      <span
        class="truncate text-xs {!isDefault ? 'cursor-text' : 'cursor-default'}"
        title={!isDefault ? "Klik 2x untuk mengubah nama layer" : "Container utama (bawaan)"}
      >
        {element.name}
      </span>
    {/if}
  </div>

  <div class="{isSelected ? 'flex' : 'hidden group-hover:flex'} shrink-0 items-center gap-1">
    <button
      onclick={(e) => {
        e.stopPropagation();
        editor.toggleVisibility(element.id);
      }}
      class="rounded p-0.5 hover:bg-black/20"
      title={element.hidden ? "Tampilkan" : "Sembunyikan"}
    >
      {#if element.hidden}
        <Icon icon="lucide:eye-off" class="h-3 w-3 text-red-400" />
      {:else}
        <Icon icon="lucide:eye" class="h-3 w-3" />
      {/if}
    </button>

    <button
      onclick={(e) => {
        e.stopPropagation();
        editor.toggleLock(element.id);
      }}
      class="rounded p-0.5 hover:bg-black/20"
      title={element.locked ? "Buka Kunci" : "Kunci Elemen"}
    >
      {#if element.locked}
        <Icon icon="lucide:lock" class="h-3 w-3 text-amber-400" />
      {:else}
        <Icon icon="lucide:unlock" class="h-3 w-3 opacity-60" />
      {/if}
    </button>

    {#if !isDefault}
      <button
        onclick={(e) => {
          e.stopPropagation();
          editor.moveLayer(element.id, "up");
        }}
        class="rounded p-0.5 hover:bg-black/20"
        title="Bawa ke Atas"
      >
        <Icon icon="lucide:chevron-up" class="h-3 w-3" />
      </button>
      <button
        onclick={(e) => {
          e.stopPropagation();
          editor.moveLayer(element.id, "down");
        }}
        class="rounded p-0.5 hover:bg-black/20"
        title="Bawa ke Bawah"
      >
        <Icon icon="lucide:chevron-down" class="h-3 w-3" />
      </button>
      <button
        onclick={(e) => {
          e.stopPropagation();
          editor.duplicateElement(element.id);
        }}
        class="rounded p-0.5 hover:bg-black/20"
        title="Duplikat (Ctrl+D)"
      >
        <Icon icon="lucide:copy" class="h-3 w-3" />
      </button>
      <button
        onclick={(e) => {
          e.stopPropagation();
          editor.deleteElement(element.id);
        }}
        class="rounded p-0.5 text-red-400 hover:bg-red-500/20"
        title="Hapus"
      >
        <Icon icon="lucide:trash-2" class="h-3 w-3" />
      </button>
    {/if}
  </div>
</div>
