<script lang="ts">
  import Icon from "@iconify/svelte";

  import { popup } from "#lib/stores/popup.svelte";
  import { processImageForUpload } from "#lib/utils/image-resize";

  let { value = $bindable("") }: { value?: string } = $props();

  let isUploading = $state(false);
  let fileInputEl = $state<HTMLInputElement>();

  async function handleUpload(file: File | null) {
    if (!file) return;
    isUploading = true;
    try {
      const processed = await processImageForUpload(file, {
        resize: true,
        maxWidth: 256,
        quality: 0.9
      });
      const formData = new FormData();
      formData.append("file", processed.file);

      const res = await fetch("/api/favicon", { method: "POST", body: formData });
      const result = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !result.url) {
        popup.error({ message: result.error || "Gagal mengunggah favicon." });
        return;
      }

      value = result.url;
    } catch (err) {
      popup.error({
        message: err instanceof Error ? err.message : "Terjadi kesalahan saat memproses favicon."
      });
    } finally {
      isUploading = false;
      if (fileInputEl) fileInputEl.value = "";
    }
  }
</script>

<input type="hidden" name="siteFavicon" {value} />

<div class="flex flex-col gap-1.5">
  <span class="block text-xs font-semibold text-gray-700">Favicon</span>
  <div class="flex flex-wrap items-center gap-3">
    <div
      class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
    >
      {#if value}
        <img src={value} alt="Preview favicon" class="h-6 w-6 object-contain" />
      {:else}
        <img src="/favicon.svg" alt="Default favicon" class="h-6 w-6 object-contain" />
      {/if}
    </div>

    <input
      bind:this={fileInputEl}
      type="file"
      accept="image/*"
      class="hidden"
      onchange={(e) => handleUpload(e.currentTarget.files?.[0] ?? null)}
    />

    <button
      type="button"
      disabled={isUploading}
      onclick={() => fileInputEl?.click()}
      class="flex h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon
        icon={isUploading ? "lucide:loader-2" : "lucide:upload"}
        class="h-4 w-4 text-gray-500 {isUploading ? 'animate-spin' : ''}"
      />
      <span>{isUploading ? "Mengunggah..." : "Unggah Favicon"}</span>
    </button>

    {#if value}
      <button
        type="button"
        onclick={() => (value = "")}
        class="flex h-11 cursor-pointer items-center rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
      >
        Reset
      </button>
    {/if}
  </div>
  <p class="text-[11px] text-gray-500">
    Unggah gambar ikon situs (disarankan rasio 1:1, misalnya PNG, SVG, atau ICO).
  </p>
</div>
