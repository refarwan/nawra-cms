<script lang="ts">
  import Icon from "@iconify/svelte";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let { editor }: { editor: EditorState } = $props();

  // Drag & Drop State
  let draggedLayerId = $state<string | null>(null);
  let dropTargetId = $state<string | null>(null);
  let dropPosition = $state<"before" | "after" | null>(null);

  // Double-Click Rename State
  let editingLayerId = $state<string | null>(null);
  let editingName = $state("");

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

  function autoFocus(node: HTMLInputElement) {
    node.focus();
    node.select();
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
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    let pos: "before" | "after" = e.clientY < midY ? "before" : "after";

    // Flexbox bawaan harus selalu tetap di posisi teratas
    if ((target.isDefault || target.id === "flexbox-default") && pos === "before") {
      pos = "after";
    }

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

  function getElementDepth(id: string): number {
    let depth = 0;
    let curr = editor.elements.find((el) => el.id === id);
    while (curr && curr.parentId) {
      depth++;
      const parentId: string = curr.parentId;
      curr = editor.elements.find((el) => el.id === parentId);
    }
    return depth;
  }

  const orderedElements = $derived.by(() => {
    const result: CanvasElement[] = [];
    function addTree(parentId: string | null) {
      const children = editor.elements.filter((el) =>
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
    for (const el of editor.elements) {
      if (!result.some((r) => r.id === el.id)) {
        result.push(el);
      }
    }
    return result;
  });

  function getIcon(type: CanvasElement["type"]) {
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
</script>

<aside
  class="flex h-full w-64 flex-col border-r border-[#2c2c2c] bg-[#1e1e1e] text-xs text-neutral-300"
>
  <!-- Header: Layers Title & Counter -->
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

  <!-- Content Area: Layers List -->
  <div class="flex-1 space-y-0.5 overflow-y-auto p-1.5">
    {#each orderedElements as element (element.id)}
      {@const iconName = getIcon(element.type)}
      {@const isSelected = editor.selectedId === element.id}
      {@const depth = getElementDepth(element.id)}
      {@const isDraggable =
        !element.isDefault && element.id !== "flexbox-default" && editingLayerId !== element.id}
      {@const isBeingDragged = draggedLayerId === element.id}
      {@const isDropTarget = dropTargetId === element.id}
      <div
        role="button"
        tabindex="0"
        draggable={isDraggable}
        ondragstart={(e) => onDragStart(e, element)}
        ondragover={(e) => onDragOver(e, element)}
        ondragleave={onDragLeave}
        ondrop={(e) => onDrop(e, element)}
        ondragend={onDragEnd}
        ondblclick={(e) => startRenaming(element, e)}
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
          : ''} {isDraggable
          ? 'cursor-grab active:cursor-grabbing'
          : 'cursor-pointer'} {isDropTarget && dropPosition === 'before'
          ? 'border-t-2 border-[#0d99ff] bg-[#0d99ff]/15'
          : ''} {isDropTarget && dropPosition === 'after'
          ? 'border-b-2 border-[#0d99ff] bg-[#0d99ff]/15'
          : ''}"
      >
        <div class="mr-2 flex flex-1 items-center gap-1.5 overflow-hidden">
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

          {#if editingLayerId === element.id}
            <input
              use:autoFocus
              type="text"
              bind:value={editingName}
              onclick={(e) => e.stopPropagation()}
              onkeydown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") saveRename(element.id);
                if (e.key === "Escape") cancelRename();
              }}
              onblur={() => saveRename(element.id)}
              class="h-5.5 w-full rounded border border-white bg-[#141414] px-1.5 text-xs font-medium text-white ring-1 ring-[#0d99ff] outline-none"
            />
          {:else}
            <span
              class="truncate text-xs {!element.isDefault && element.id !== 'flexbox-default'
                ? 'cursor-text'
                : 'cursor-default'}"
              title={!element.isDefault && element.id !== "flexbox-default"
                ? "Klik 2x untuk mengubah nama layer"
                : "Container utama (bawaan)"}
            >
              {element.name}
            </span>
          {/if}
        </div>

        <!-- Action Icons (visible on hover or when selected) -->
        <div
          class="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 {isSelected
            ? 'opacity-100'
            : ''}"
        >
          <!-- Hide / Show -->
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

          <!-- Lock / Unlock -->
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

          <!-- Reorder Layers -->
          {#if !element.isDefault && element.id !== "flexbox-default"}
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
          {/if}

          <!-- Duplicate -->
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

          <!-- Delete -->
          {#if !element.isDefault && element.id !== "flexbox-default"}
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
    {/each}

    {#if editor.elements.length === 0}
      <div class="p-6 text-center text-neutral-500">
        <p>Belum ada layer.</p>
        <p class="mt-1 text-[11px]">Pilih tool di atas untuk menambahkan elemen ke kanvas.</p>
      </div>
    {/if}
  </div>
</aside>
