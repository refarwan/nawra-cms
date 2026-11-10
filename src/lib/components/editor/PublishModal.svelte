<script lang="ts">
  import Icon from "@iconify/svelte";

  import type { EditorState } from "./editor-state.svelte";

  let { editor, onClose }: { editor: EditorState; onClose: () => void } = $props();

  let copied = $state(false);

  const publicUrl = "https://nawra-cms.workers.dev";

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
>
  <div
    class="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#18181b] p-6 text-neutral-200 shadow-2xl"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400"
        >
          <Icon icon="lucide:check-circle" class="h-6 w-6" />
        </div>
        <div>
          <h3 class="text-base font-bold text-white">Halaman Berhasil Diterbitkan!</h3>
          <p class="text-xs text-neutral-400">Live di Jaringan Edge Cloudflare Workers</p>
        </div>
      </div>
      <button
        onclick={onClose}
        class="rounded-lg p-1 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
      >
        <Icon icon="lucide:x" class="h-4 w-4" />
      </button>
    </div>

    <!-- Details Card -->
    <div class="mt-5 space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-xs">
      <div class="flex items-center justify-between">
        <span class="text-neutral-400">Proyek / Kanvas:</span>
        <span class="font-medium text-white">{editor.frame.name}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-neutral-400">Waktu Terbit:</span>
        <span class="text-neutral-300">{editor.lastPublishedAt}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-neutral-400">Status Server:</span>
        <span class="inline-flex items-center gap-1.5 font-medium text-emerald-400">
          <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
          SSR Edge Aktif
        </span>
      </div>
    </div>

    <!-- URL Box -->
    <div class="mt-4">
      <span class="mb-1.5 block text-[11px] font-medium text-neutral-400">Link Publik Website:</span
      >
      <div
        class="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs"
      >
        <Icon icon="lucide:globe" class="h-4 w-4 shrink-0 text-neutral-500" />
        <span class="flex-1 truncate font-mono text-neutral-300">{publicUrl}</span>
        <button
          onclick={copyUrl}
          class="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1 text-[11px] font-medium text-neutral-200 transition hover:bg-neutral-700 hover:text-white"
        >
          {#if copied}
            <Icon icon="lucide:check" class="h-3 w-3 text-emerald-400" />
            <span>Tersalin</span>
          {:else}
            <Icon icon="lucide:copy" class="h-3 w-3" />
            <span>Salin</span>
          {/if}
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex items-center justify-end gap-2">
      <button
        onclick={onClose}
        class="rounded-lg border border-neutral-800 bg-neutral-800/60 px-4 py-2 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
      >
        Tutup
      </button>
      <button
        onclick={() => {
          editor.isPreviewMode = true;
          onClose();
        }}
        class="flex items-center gap-1.5 rounded-lg bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95"
      >
        <Icon icon="lucide:external-link" class="h-3.5 w-3.5" />
        <span>Lihat Tampilan Website</span>
      </button>
    </div>
  </div>
</div>
