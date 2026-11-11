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

  const isHome = $derived(editor.targetType === "homepage" || editor.targetType === "home");
  const targetLabel = $derived(
    editor.targetType === "header"
      ? "Header"
      : editor.targetType === "footer"
        ? "Footer"
        : isHome
          ? "Home Page"
          : "Desain Kanvas"
  );

  const backHref = $derived(
    editor.targetType === "header"
      ? resolve("/(dashboard)/(authenticated)/dashboard/header")
      : editor.targetType === "footer"
        ? resolve("/(dashboard)/(authenticated)/dashboard/footer")
        : isHome
          ? resolve("/(dashboard)/(authenticated)/dashboard/home")
          : null
  );

  const statusTitle = $derived(
    saving
      ? "Menyimpan ke Database..."
      : saveError
        ? "Gagal Mempublikasikan"
        : `${targetLabel} Berhasil Diterbitkan!`
  );
  const statusDesc = $derived(
    saving
      ? "Mengenerate HTML dan menyimpan ke Cloudflare D1"
      : saveError
        ? "Terjadi kendala saat menyimpan"
        : "Konten HTML & JSON tersimpan di Cloudflare D1"
  );
  const statusColorClass = $derived(
    saveError
      ? "bg-red-500/15 text-red-400"
      : saveSuccess
        ? "bg-emerald-500/15 text-emerald-400"
        : "bg-blue-500/15 text-blue-400"
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
      const contentHtml = generateHtmlFromElements(
        editor.elements,
        editor.frame,
        editor.targetType
      );

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
        <div class="flex h-11 w-11 items-center justify-center rounded-xl {statusColorClass}">
          <Icon
            icon={saving
              ? "lucide:loader-2"
              : saveError
                ? "lucide:alert-circle"
                : "lucide:check-circle"}
            class="h-6 w-6 {saving ? 'animate-spin' : ''}"
          />
        </div>
        <div>
          <h3 class="text-base font-bold text-white">{statusTitle}</h3>
          <p class="text-xs text-neutral-400">{statusDesc}</p>
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
    <div
      class="mt-5 space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 text-xs"
    >
      {#each [["Tipe:", targetLabel, "font-medium text-white"], ["Judul:", editor.frame.name, "font-medium text-white"], ["Format:", "JSON & HTML", "text-neutral-300"], ["Database:", "Cloudflare D1", "font-medium text-emerald-400"]] as [label, val, cls] (label)}
        <div class="flex justify-between">
          <span class="text-neutral-400">{label}</span><span class={cls}>{val}</span>
        </div>
      {/each}
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex items-center justify-end gap-2">
      <button
        onclick={onClose}
        class="rounded-lg border border-neutral-800 bg-neutral-800/60 px-4 py-2 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
      >
        Tutup
      </button>
      {#if backHref}
        <a
          href={backHref}
          class="flex items-center gap-1.5 rounded-lg bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 active:scale-95"
        >
          <Icon icon="lucide:arrow-left" class="h-3.5 w-3.5" />
          <span>Kembali ke Kelola {targetLabel}</span>
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
