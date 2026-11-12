<script lang="ts">
  import Icon from "@iconify/svelte";

  import { popup } from "#lib/stores/popup.svelte";
  import { processImageForUpload } from "#lib/utils/image-resize";

  import type { AuthUser } from "../../../../../../app.d";

  let {
    user,
    onSaveAvatar
  }: {
    user: AuthUser | null;
    onSaveAvatar: (avatarUrl: string) => void;
  } = $props();

  let fileInputEl = $state<HTMLInputElement>();
  let isUploading = $state(false);

  const formattedCreated = $derived(
    user?.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID") : "-"
  );

  const initial = $derived(
    (user?.name?.[0] || user?.username?.[0] || user?.email?.[0] || "U").toUpperCase()
  );

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

      onSaveAvatar(data.url);
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

<div
  class="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between"
>
  <div class="flex items-center gap-4">
    {#if user?.avatarUrl}
      <img
        src={user.avatarUrl}
        alt={user?.name || user?.username || "Foto profil"}
        class="h-16 w-16 shrink-0 rounded-2xl border border-gray-200 object-cover"
      />
    {:else}
      <div
        class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-xl font-bold text-sky-600"
      >
        {initial}
      </div>
    {/if}

    <div class="min-w-0">
      <h2 class="truncate text-base font-bold text-gray-900 md:text-lg">
        {user?.name || user?.username || "Pengguna Nawra"}
      </h2>
      <p class="truncate text-xs text-gray-500">
        @{user?.username || "user"} · {user?.email}
      </p>
      <div class="mt-1.5 flex items-center gap-2">
        <span
          class="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-600 capitalize"
        >
          {user?.role || "Editor"}
        </span>
        <span class="text-[11px] text-gray-400">Terdaftar: {formattedCreated}</span>
      </div>
    </div>
  </div>

  <div class="flex flex-wrap items-center gap-2">
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
      class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-sky-600 hover:text-sky-600 disabled:opacity-50"
    >
      <Icon
        icon={isUploading ? "lucide:loader-2" : "lucide:upload"}
        class="h-3.5 w-3.5 {isUploading ? 'animate-spin' : ''}"
      />
      <span>{isUploading ? "Mengunggah..." : "Upload Foto"}</span>
    </button>

    {#if user?.avatarUrl}
      <button
        type="button"
        onclick={() => onSaveAvatar("")}
        class="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
        title="Hapus foto profil"
      >
        <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
      </button>
    {/if}
  </div>
</div>
