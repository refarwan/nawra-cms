<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import type { EditorState } from "./editor-state.svelte";
  import type { DeviceMode } from "./types";

  let { editor }: { editor: EditorState } = $props();

  const devices: { mode: DeviceMode; label: string; icon: string }[] = [
    { mode: "desktop", label: "Desktop (1280px)", icon: "lucide:monitor" },
    { mode: "tablet", label: "Tablet (768px)", icon: "lucide:tablet" },
    { mode: "mobile", label: "Mobile (390px)", icon: "lucide:smartphone" }
  ];
</script>

<header
  class="flex h-12 w-full items-center justify-between border-b border-[#2c2c2c] bg-[#1a1a1c] px-3 text-[#d3d3d3] select-none"
>
  <!-- Left: Logo & File Info -->
  <div class="flex items-center gap-3">
    <a
      href={resolve("/")}
      title="Kembali ke Beranda"
      class="flex items-center gap-2 rounded px-1.5 py-1 transition hover:bg-[#2c2c2c]"
    >
      <!-- Colorful studio icon -->
      <div
        class="flex h-6 w-6 items-center justify-center rounded bg-linear-to-tr from-[#0d99ff] via-[#9747ff] to-[#ff4785] p-1"
      >
        <Icon icon="lucide:sparkles" class="h-3.5 w-3.5 text-white" />
      </div>
      <div class="flex flex-col">
        <span class="text-xs font-semibold text-white">Nawra CMS</span>
        <span class="text-[10px] text-neutral-400">Studio Kanvas</span>
      </div>
    </a>

    <div class="h-4 w-px bg-[#333]"></div>

    <!-- Undo / Redo -->
    <div class="flex items-center gap-1">
      <button
        onclick={() => editor.undo()}
        disabled={editor.historyIndex <= 0}
        class="flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition hover:bg-[#2c2c2c] hover:text-white disabled:opacity-30"
        title="Undo (Ctrl+Z)"
      >
        <Icon icon="lucide:undo-2" class="h-4 w-4" />
      </button>
      <button
        onclick={() => editor.redo()}
        disabled={editor.historyIndex >= editor.history.length - 1}
        class="flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition hover:bg-[#2c2c2c] hover:text-white disabled:opacity-30"
        title="Redo (Ctrl+Y)"
      >
        <Icon icon="lucide:redo-2" class="h-4 w-4" />
      </button>
    </div>
  </div>

  <!-- Center: File Title & Responsive Device Switcher -->
  <div class="flex items-center gap-3">
    <div class="hidden items-center gap-1.5 text-xs font-medium text-neutral-300 md:flex">
      <span>{editor.frame.name}</span>
      <span class="text-neutral-600">•</span>
    </div>

    <!-- Device Preview Switcher -->
    <div class="flex items-center rounded-lg border border-[#333338] bg-[#222226] p-0.5 text-xs">
      {#each devices as dev (dev.mode)}
        <button
          onclick={() => editor.setDevice(dev.mode)}
          class="flex h-7 items-center gap-1.5 rounded-md px-2.5 transition {editor.device ===
          dev.mode
            ? 'bg-[#323238] font-medium text-white'
            : 'text-neutral-400 hover:text-white'}"
          title={dev.label}
        >
          <Icon icon={dev.icon} class="h-3.5 w-3.5" />
          <span class="hidden text-[11px] capitalize sm:inline">{dev.mode}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Right: Zoom Controls, Preview, & Publish -->
  <div class="flex items-center gap-2">
    <!-- Zoom Controls -->
    <div class="flex items-center gap-1 rounded bg-[#2c2c2c] px-1 py-0.5 text-xs">
      <button
        onclick={() => editor.zoomOut()}
        class="p-1 text-neutral-400 hover:text-white"
        title="Perkecil Tampilan"
      >
        <Icon icon="lucide:zoom-out" class="h-3.5 w-3.5" />
      </button>
      <button
        onclick={() => editor.resetZoom()}
        class="px-1 font-mono text-[11px] font-medium text-neutral-300 hover:text-white"
        title="Kembalikan ke 100%"
      >
        {Math.round(editor.zoom * 100)}%
      </button>
      <button
        onclick={() => editor.zoomIn()}
        class="p-1 text-neutral-400 hover:text-white"
        title="Perbesar Tampilan"
      >
        <Icon icon="lucide:zoom-in" class="h-3.5 w-3.5" />
      </button>
    </div>

    <div class="h-4 w-px bg-[#333]"></div>

    <!-- Visitor Preview Toggle -->
    <button
      onclick={() => (editor.isPreviewMode = !editor.isPreviewMode)}
      class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition {editor.isPreviewMode
        ? 'border border-amber-500/40 bg-amber-500/20 text-amber-300'
        : 'bg-[#2c2c2c] text-neutral-300 hover:bg-[#383838] hover:text-white'}"
      title="Lihat seperti pengunjung asli"
    >
      <Icon icon="lucide:eye" class="h-3.5 w-3.5" />
      <span class="hidden sm:inline">{editor.isPreviewMode ? "Tutup Pratinjau" : "Pratinjau"}</span>
    </button>

    <!-- Publish Website CTA -->
    <button
      onclick={() => editor.publish()}
      class="flex items-center gap-1.5 rounded-md bg-[#0d99ff] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 active:scale-95"
    >
      <Icon icon="lucide:upload-cloud" class="h-3.5 w-3.5" />
      <span>Publikasikan</span>
    </button>
  </div>
</header>
