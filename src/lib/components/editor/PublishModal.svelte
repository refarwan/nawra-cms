<script lang="ts">
  import { untrack } from "svelte";
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import { generateHtmlFromElements } from "./html-generator";

  import type { EditorState } from "./editor-state.svelte";

  let { editor, onClose }: { editor: EditorState; onClose: () => void } = $props();

  let saving = $state(false);
  let saveSuccess = $state(false);
  let saveError = $state<string | null>(null);

  const targetLabel = $derived(
    editor.targetType === "header"
      ? "Header"
      : editor.targetType === "footer"
        ? "Footer"
        : "Desain Kanvas"
  );

  async function saveToDatabase() {
    if (!editor.targetType || !editor.targetId) {
      saveSuccess = true;
      return;
    }

    saving = true;
    saveError = null;

    try {
      const contentJson = JSON.stringify({
        elements: editor.elements,
        frame: editor.frame
      });
      const contentHtml = generateHtmlFromElements(editor.elements, editor.frame);

      const res = await fetch("/api/editor/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: editor.targetType,
          id: editor.targetId,
          title: editor.frame.name,
          contentJson,
          contentHtml
        })
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan konten ke server.");
      }

      saveSuccess = true;
    } catch (err) {
      console.error(err);
      saveError = err instanceof Error ? err.message : String(err);
    } finally {
      saving = false;
    }
  }

  $effect(() => {
    untrack(() => {
      void saveToDatabase();
    });
  });
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
>
  <div
    class="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#18181b] p-6 text-neutral-200"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-xl {saveError
            ? 'bg-red-500/15 text-red-400'
            : saveSuccess
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-blue-500/15 text-blue-400'}"
        >
          {#if saving}
            <Icon icon="lucide:loader-2" class="h-6 w-6 animate-spin" />
          {:else if saveError}
            <Icon icon="lucide:alert-circle" class="h-6 w-6" />
          {:else}
            <Icon icon="lucide:check-circle" class="h-6 w-6" />
          {/if}
        </div>
        <div>
          <h3 class="text-base font-bold text-white">
            {#if saving}
              Menyimpan ke Database...
            {:else if saveError}
              Gagal Mempublikasikan
            {:else}
              {targetLabel} Berhasil Diterbitkan!
            {/if}
          </h3>
          <p class="text-xs text-neutral-400">
            {#if saving}
              Mengenerate HTML dan menyimpan ke Cloudflare D1
            {:else if saveError}
              Terjadi kendala saat menyimpan
            {:else}
              Konten HTML & JSON tersimpan di Cloudflare D1
            {/if}
          </p>
        </div>
      </div>
      <button
        onclick={onClose}
        class="rounded-lg p-1 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
      >
        <Icon icon="lucide:x" class="h-4 w-4" />
      </button>
    </div>

    {#if saveError}
      <div class="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
        {saveError}
      </div>
    {/if}

    <!-- Details Card -->
    <div class="mt-5 space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-xs">
      <div class="flex items-center justify-between">
        <span class="text-neutral-400">Tipe Konten:</span>
        <span class="font-medium text-white">{targetLabel}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-neutral-400">Judul:</span>
        <span class="font-medium text-white">{editor.frame.name}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-neutral-400">Format:</span>
        <span class="text-neutral-300">JSON (Editor) & HTML (Frontend)</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-neutral-400">Status Server:</span>
        <span class="inline-flex items-center gap-1.5 font-medium text-emerald-400">
          <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
          Cloudflare D1 Tersinkron
        </span>
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
      {#if editor.targetType === "header"}
        <a
          href={resolve("/(dashboard)/(authenticated)/dashboard/header")}
          class="flex items-center gap-1.5 rounded-lg bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 active:scale-95"
        >
          <Icon icon="lucide:arrow-left" class="h-3.5 w-3.5" />
          <span>Kembali ke Kelola Header</span>
        </a>
      {:else if editor.targetType === "footer"}
        <a
          href={resolve("/(dashboard)/(authenticated)/dashboard/footer")}
          class="flex items-center gap-1.5 rounded-lg bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 active:scale-95"
        >
          <Icon icon="lucide:arrow-left" class="h-3.5 w-3.5" />
          <span>Kembali ke Kelola Footer</span>
        </a>
      {:else}
        <button
          onclick={() => {
            editor.isPreviewMode = true;
            onClose();
          }}
          class="flex items-center gap-1.5 rounded-lg bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 active:scale-95"
        >
          <Icon icon="lucide:eye" class="h-3.5 w-3.5" />
          <span>Lihat Pratinjau</span>
        </button>
      {/if}
    </div>
  </div>
</div>
