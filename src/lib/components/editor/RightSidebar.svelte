<script lang="ts">
  import Icon from "@iconify/svelte";

  import SidebarCanvasSettings from "./SidebarCanvasSettings.svelte";
  import SidebarMediaSection from "./SidebarMediaSection.svelte";
  import SidebarPositionSection from "./SidebarPositionSection.svelte";
  import SidebarSpacingSection from "./SidebarSpacingSection.svelte";
  import SidebarStyleSection from "./SidebarStyleSection.svelte";
  import SidebarTypographySection from "./SidebarTypographySection.svelte";

  import type { EditorState } from "./editor-state.svelte";

  let { editor }: { editor: EditorState } = $props();

  const el = $derived(editor.selectedElement);
</script>

<aside
  class="flex h-full w-72 flex-col border-l border-[#2c2c2c] bg-[#1e1e1e] text-xs text-neutral-300"
>
  {#if el}
    <!-- Element Header -->
    <div class="flex items-center justify-between border-b border-[#2c2c2c] px-4 py-3">
      <div class="flex items-center gap-2">
        <span
          class="rounded bg-[#2c2c2c] px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#0d99ff] uppercase"
        >
          {el.type}
        </span>
        {#if el.isDefault || el.id === "flexbox-default"}
          <span class="px-1 font-medium text-white select-none">{el.name}</span>
        {:else}
          <input
            type="text"
            value={el.name}
            oninput={(e) => {
              editor.updateElement(el.id, { name: (e.target as HTMLInputElement).value });
            }}
            class="-mx-1 rounded bg-transparent px-1 font-medium text-white focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
          />
        {/if}
      </div>
      <div class="flex items-center gap-1">
        {#if !el.isDefault && el.id !== "flexbox-default"}
          <button
            onclick={() => editor.duplicateElement(el.id)}
            class="rounded p-1 text-neutral-400 hover:bg-[#2c2c2c] hover:text-white"
            title="Duplikat (Ctrl+D)"
          >
            <Icon icon="lucide:copy" class="h-3.5 w-3.5" />
          </button>
          <button
            onclick={() => editor.deleteElement(el.id)}
            class="rounded p-1 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            title="Hapus Elemen"
          >
            <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
          </button>
        {/if}
      </div>
    </div>

    <!-- Properties Form -->
    <div class="flex-1 space-y-5 overflow-y-auto p-4">
      <div class="space-y-3">
        <SidebarPositionSection {editor} {el} />
        <SidebarSpacingSection {editor} {el} />
      </div>
      <SidebarTypographySection {editor} {el} />
      <SidebarMediaSection {editor} {el} />
      <SidebarStyleSection {editor} {el} />
    </div>
  {:else}
    <SidebarCanvasSettings {editor} />
  {/if}
</aside>
