<script lang="ts">
  import { untrack } from "svelte";

  import BottomToolbar from "./BottomToolbar.svelte";
  import Canvas from "./Canvas.svelte";
  import { EditorState } from "./editor-state.svelte";
  import LeftSidebar from "./LeftSidebar.svelte";
  import PublishModal from "./PublishModal.svelte";
  import RightSidebar from "./RightSidebar.svelte";
  import TopNav from "./TopNav.svelte";

  let {
    serverTimestamp,
    cfCountry,
    targetItem,
    targetType
  }: {
    serverTimestamp?: string;
    cfCountry?: string;
    targetItem?: { id: string; title: string; contentJson: string; contentHtml: string } | null;
    targetType?: "header" | "footer" | null;
  } = $props();

  const editor = new EditorState();
  let loadedTargetId: string | null = null;

  $effect(() => {
    const current = targetItem;
    const currentType = targetType;
    if (current && current.id && loadedTargetId !== current.id) {
      loadedTargetId = current.id;
      untrack(() => {
        if (currentType) editor.targetType = currentType;
        editor.targetId = current.id;
        if (current.title) editor.frame.name = current.title;

        if (current.contentJson) {
          editor.loadFromJson(
            current.contentJson,
            current.title,
            currentType || undefined,
            current.id
          );
        }
      });
    }
  });
</script>

<div
  class="flex h-screen w-screen flex-col overflow-hidden bg-[#1e1e1e] font-sans text-neutral-200 antialiased"
>
  <!-- Top Navigation Bar -->
  <TopNav {editor} />

  <!-- Main Visual Canvas Workspace -->
  <div class="relative flex flex-1 overflow-hidden">
    <!-- Left Sidebar (Pages, Sections & Layers) -->
    {#if !editor.isPreviewMode}
      <LeftSidebar {editor} />
    {/if}

    <!-- Center Visual Canvas -->
    <Canvas {editor} />

    <!-- Floating Bottom Island Toolbar Dock -->
    {#if !editor.isPreviewMode}
      <BottomToolbar {editor} />
    {/if}

    <!-- Right Inspector Properties Panel -->
    {#if !editor.isPreviewMode}
      <RightSidebar {editor} />
    {/if}
  </div>

  <!-- Bottom Status Bar -->
  <footer
    class="flex h-7 w-full items-center justify-between border-t border-[#2c2c2c] bg-[#181818] px-3 text-[11px] text-neutral-400 select-none"
  >
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1.5">
        <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
        <span class="font-medium text-neutral-300">Cloudflare Workers SSR</span>
      </div>
      <span class="text-neutral-600">•</span>
      <span>Kanvas: <strong class="text-neutral-200">{editor.frame.name}</strong></span>
      {#if cfCountry}
        <span class="text-neutral-600">•</span>
        <span>Region: <strong class="text-neutral-300">{cfCountry}</strong></span>
      {/if}
      {#if serverTimestamp}
        <span class="text-neutral-600">•</span>
        <span>Server Sync: {new Date(serverTimestamp).toLocaleTimeString()}</span>
      {/if}
    </div>

    <div class="flex items-center gap-3">
      <span>{editor.elements.length} Elemen</span>
      <span class="text-neutral-600">•</span>
      {#if editor.selectedElement}
        <span class="font-medium text-[#0d99ff]">Terpilih: {editor.selectedElement.name}</span>
      {:else}
        <span>Tidak ada pilihan</span>
      {/if}
    </div>
  </footer>

  <!-- Publish Success Modal -->
  {#if editor.isPublishModalOpen}
    <PublishModal {editor} onClose={() => (editor.isPublishModalOpen = false)} />
  {/if}
</div>
