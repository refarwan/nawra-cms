<script lang="ts">
  import Icon from "@iconify/svelte";

  import { popup } from "#lib/stores/popup.svelte";
  import { processImageForUpload } from "#lib/utils/image-resize";

  let {
    avatarUrl = $bindable(""),
    name = "",
    username = ""
  }: {
    avatarUrl?: string;
    name?: string;
    username?: string;
  } = $props();

  let fileInputEl = $state<HTMLInputElement>();
  let isUploading = $state(false);

  const initial = $derived((name.trim() || username.trim() || "E").charAt(0).toUpperCase() || "E");

  async function handleFileSelect(file: File | null) {
    if (!file) return;
    isUploading = true;
    try {
      const processed = await processImageForUpload(file, {
        resize: true,
        maxWidth: 400,
        quality: 0.85
      });

      const formData = new FormData();
      formData.append("file", processed.file);

      const res = await fetch("/api/avatar", { method: "POST", body: formData });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        popup.error({ message: data.error || "Gagal mengunggah foto profil." });
        return;
      }

      avatarUrl = data.url;
    } catch (err) {
      popup.error({
        message: err instanceof Error ? err.message : "Terjadi kesalahan saat memproses foto."
      });
    } finally {
      isUploading = false;
      if (fileInputEl) fileInputEl.value = "";
    }
  }
</script>

<input type="hidden" name="avatarUrl" value={avatarUrl} />

<div class="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-gray-50/50 p-3">
  {#if avatarUrl}
    <img
      src={avatarUrl}
      alt={name || username || "Foto profil"}
      class="h-14 w-14 shrink-0 rounded-full border border-gray-200 object-cover"
    />
  {:else}
    <div
      class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-base font-bold text-sky-600"
    >
      {initial}
    </div>
  {/if}

  <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
    <input
      bind:this={fileInputEl}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
      class="hidden"
      onchange={(e) => handleFileSelect((e.currentTarget as HTMLInputElement).files?.[0] ?? null)}
    />

    <button
      type="button"
      disabled={isUploading}
      onclick={() => fileInputEl?.click()}
      class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
    >
      <Icon
        icon={isUploading ? "lucide:loader-2" : "lucide:upload"}
        class="h-3.5 w-3.5 {isUploading ? 'animate-spin' : ''}"
      />
      <span>{isUploading ? "Mengunggah..." : "Unggah Foto"}</span>
    </button>

    {#if avatarUrl}
      <button
        type="button"
        onclick={() => (avatarUrl = "")}
        class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
      >
        <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
        <span>Hapus</span>
      </button>
    {/if}
  </div>
</div>
