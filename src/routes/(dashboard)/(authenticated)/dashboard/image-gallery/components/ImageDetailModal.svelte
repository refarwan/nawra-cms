<script lang="ts">
  import Icon from "@iconify/svelte";

  import Textfield from "#lib/components/Textfield.svelte";
  import { popup } from "#lib/stores/popup.svelte";
  import { getRequiredErrors } from "#lib/utils/form-validation";
  import { formatFileSize } from "#lib/utils/image-resize";

  import UserAvatarBadge from "../../../components/UserAvatarBadge.svelte";

  import type { ImageLibraryItem } from "#db/schema";

  export type ImageGalleryItem = ImageLibraryItem & {
    uploaderName?: string | null;
    uploaderAvatarUrl?: string | null;
  };

  let {
    image,
    onClose,
    onChanged
  }: {
    image: ImageGalleryItem;
    onClose: () => void;
    onChanged: () => void;
  } = $props();

  let name = $state("");
  let altText = $state("");
  let copied = $state(false);
  let isSaving = $state(false);
  let isDeleting = $state(false);
  let hasSubmitted = $state(false);
  let errorMsg = $state("");

  const nameErrors = $derived(getRequiredErrors(name, "Nama gambar", hasSubmitted));

  $effect(() => {
    name = image.name;
    altText = image.altText;
    hasSubmitted = false;
  });

  const copyUrl = async () => {
    await navigator.clipboard.writeText(image.url);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();
    hasSubmitted = true;
    if (nameErrors.length > 0) return;

    isSaving = true;
    errorMsg = "";
    try {
      const res = await fetch(`/api/media/${image.r2Key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, altText })
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        errorMsg = data.error || "Gagal menyimpan perubahan.";
        return;
      }
      onChanged();
    } finally {
      isSaving = false;
    }
  };

  const handleDelete = () => {
    popup.confirm({
      title: "Hapus Gambar",
      message: `Hapus gambar "${image.name}" secara permanen?`,
      confirmText: "Hapus",
      onConfirm: async () => {
        isDeleting = true;
        try {
          const res = await fetch(`/api/media/${image.r2Key}`, { method: "DELETE" });
          if (res.ok) onChanged();
        } finally {
          isDeleting = false;
        }
      }
    });
  };
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs"
>
  <div class="my-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6">
    <div class="flex items-center justify-between border-b border-gray-100 pb-4">
      <h3 class="text-sm font-bold text-gray-900">Detail Gambar</h3>
      <button
        type="button"
        onclick={onClose}
        class="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
      >
        <Icon icon="lucide:x" class="h-4 w-4" />
      </button>
    </div>

    <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      <img
        src={image.url}
        alt={image.altText || image.name}
        class="max-h-64 w-full object-contain"
      />
    </div>

    <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
      <span>{image.width}×{image.height} px · {formatFileSize(image.size)} · {image.mimeType}</span>
      <button
        type="button"
        onclick={copyUrl}
        class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
      >
        <Icon icon={copied ? "lucide:check" : "lucide:copy"} class="h-3.5 w-3.5" />
        <span>{copied ? "Tersalin" : "Salin URL"}</span>
      </button>
    </div>

    <div
      class="mt-3 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-2 text-xs text-gray-600"
    >
      <span class="font-medium text-gray-500">Pengunggah</span>
      <UserAvatarBadge name={image.uploaderName} avatarUrl={image.uploaderAvatarUrl} />
    </div>

    <form onsubmit={handleSave} novalidate class="mt-4 space-y-3">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Textfield
          id="detail-img-name"
          label="Nama Gambar"
          required
          bind:value={name}
          isError={nameErrors.length > 0}
          supporting={nameErrors}
        />
        <Textfield id="detail-img-alt" label="Alt Text" bind:value={altText} />
      </div>

      {#if errorMsg}
        <p class="text-xs font-medium text-red-600">{errorMsg}</p>
      {/if}

      <div class="flex items-center justify-between pt-2">
        <button
          type="button"
          onclick={handleDelete}
          disabled={isDeleting}
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
          <span>{isDeleting ? "Menghapus..." : "Hapus"}</span>
        </button>

        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            Tutup
          </button>
          <button
            type="submit"
            disabled={isSaving}
            class="cursor-pointer rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008ae6]"
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
