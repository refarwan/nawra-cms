<script lang="ts">
  import Icon from "@iconify/svelte";

  import type { EditorState } from "./editor-state.svelte";

  let {
    editor,
    activeFollower,
    isMouseInsideCanvas,
    isPanActive,
    isCanvasPanning,
    mouseClientPos
  }: {
    editor: EditorState;
    activeFollower: { type: string; label: string } | null;
    isMouseInsideCanvas: boolean;
    isPanActive: boolean;
    isCanvasPanning: boolean;
    mouseClientPos: { x: number; y: number };
  } = $props();

  const typeLabels: Record<string, string> = {
    heading: "Judul (Heading)",
    text: "Paragraf Teks",
    button: "Tombol",
    link: "Tautan (Link)",
    image: "Gambar",
    icon: "Ikon",
    frame: "Flexbox",
    youtube: "Iframe YouTube"
  };
</script>

{#if activeFollower && isMouseInsideCanvas && !isPanActive && !isCanvasPanning && !editor.isPreviewMode}
  <div
    class="pointer-events-none fixed z-50 flex items-center gap-1.5 rounded-full border border-[#0d99ff]/50 bg-[#16161a]/95 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md select-none"
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

{#if editor.isPreviewMode}
  <div
    class="absolute top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-neutral-700 bg-neutral-900/90 px-4 py-2 text-xs text-white backdrop-blur"
  >
    <span class="flex items-center gap-1.5 font-medium text-amber-400">
      <Icon icon="lucide:eye" class="h-3.5 w-3.5" />
      Mode Pratinjau Pengunjung
    </span>
    <button
      onclick={() => (editor.isPreviewMode = false)}
      class="rounded-full bg-[#0d99ff] px-3 py-1 font-semibold text-white transition hover:brightness-110"
    >
      Kembali ke Desain
    </button>
  </div>
{/if}

{#if editor.pendingElementType}
  <div
    class="absolute top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#0d99ff]/50 bg-[#141b2b]/95 px-4 py-2 text-xs text-white backdrop-blur select-none"
  >
    <span class="flex items-center gap-2 font-medium text-[#0d99ff]">
      <span class="relative flex h-2.5 w-2.5">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0d99ff] opacity-75"
        ></span>
        <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0d99ff]"></span>
      </span>
      <span>
        Klik pada Kanvas atau Flexbox untuk menempatkan {typeLabels[editor.pendingElementType] ||
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

{#if !editor.isPreviewMode}
  <div
    class="absolute top-3 left-3 z-30 flex items-center gap-2 rounded-lg border border-[#2c2c2c] bg-[#1e1e1e]/90 px-3 py-1.5 text-xs text-neutral-400 backdrop-blur select-none"
  >
    <span class="text-neutral-300">2 Jari Trackpad: Pinch Zoom &amp; Geser</span>
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
