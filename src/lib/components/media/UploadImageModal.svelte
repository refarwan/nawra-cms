<script lang="ts">
  import Icon from "@iconify/svelte";

  import { formatFileSize, processImageForUpload } from "#lib/utils/image-resize";

  import ResizeOptionsBox from "./ResizeOptionsBox.svelte";

  import type { ImageLibraryItem } from "#db/schema";

  let {
    onClose,
    onUploaded
  }: {
    onClose: () => void;
    onUploaded: (image: ImageLibraryItem) => void;
  } = $props();

  let selectedFile = $state<File | null>(null);
  let previewUrl = $state("");
  let name = $state("");
  let altText = $state("");
  let shouldResize = $state(true);
  let maxWidth = $state<number>(1600);
  let isUploading = $state(false);
  let errorMsg = $state("");

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    selectedFile = file;
    previewUrl = URL.createObjectURL(file);
    if (!name) name = file.name.replace(/\.[^.]+$/, "");
    errorMsg = "";
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!selectedFile) return;

    isUploading = true;
    errorMsg = "";

    try {
      const processed = await processImageForUpload(selectedFile, {
        resize: shouldResize,
        maxWidth,
        quality: 0.85
      });

      const formData = new FormData();
      formData.append("file", processed.file);
      formData.append("name", name.trim() || processed.file.name);
      formData.append("altText", altText.trim() || name.trim());
      formData.append("width", String(processed.width));
      formData.append("height", String(processed.height));
      formData.append("isResized", processed.isResized ? "1" : "0");

      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = (await res.json()) as { image?: ImageLibraryItem; error?: string };

      if (!res.ok || !data.image) {
        errorMsg = data.error || "Gagal mengunggah gambar.";
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      onUploaded(data.image);
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses gambar.";
    } finally {
      isUploading = false;
    }
  };
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-70 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs"
>
  <div class="my-auto w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6">
    <div class="flex items-center justify-between border-b border-gray-100 pb-4">
      <div class="flex items-center gap-2.5">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#0d99ff]"
        >
          <Icon icon="lucide:upload-cloud" class="h-4 w-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">Upload Gambar ke Galeri</h3>
          <p class="text-[11px] text-gray-500">Disimpan ke Cloudflare R2</p>
        </div>
      </div>

      <button
        type="button"
        onclick={onClose}
        class="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
      >
        <Icon icon="lucide:x" class="h-4 w-4" />
      </button>
    </div>

    <form onsubmit={handleSubmit} class="mt-5 space-y-4">
      <label
        class="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-5 text-center transition-colors hover:border-[#0d99ff] hover:bg-blue-50/30"
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
          class="hidden"
          onchange={(e) =>
            handleFileChange((e.currentTarget as HTMLInputElement).files?.[0] ?? null)}
        />
        {#if previewUrl && selectedFile}
          <img src={previewUrl} alt="Preview" class="max-h-36 rounded-lg object-contain" />
          <span class="mt-2 text-xs font-medium text-gray-700">
            {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </span>
        {:else}
          <Icon icon="lucide:image-plus" class="h-8 w-8 text-gray-400" />
          <span class="mt-2 text-xs font-semibold text-gray-700">
            Klik untuk memilih gambar (maks. 10MB)
          </span>
          <span class="mt-0.5 text-[11px] text-gray-400">JPG, PNG, WebP, AVIF, GIF, SVG</span>
        {/if}
      </label>

      <ResizeOptionsBox bind:shouldResize bind:maxWidth />

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label for="upload-img-name" class="block text-xs font-semibold text-gray-700">
            Nama Gambar
          </label>
          <input
            id="upload-img-name"
            type="text"
            bind:value={name}
            required
            placeholder="Hero Banner"
            class="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#0d99ff] focus:outline-none"
          />
        </div>
        <div>
          <label for="upload-img-alt" class="block text-xs font-semibold text-gray-700">
            Alt Text (SEO)
          </label>
          <input
            id="upload-img-alt"
            type="text"
            bind:value={altText}
            placeholder="Deskripsi singkat gambar"
            class="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#0d99ff] focus:outline-none"
          />
        </div>
      </div>

      {#if errorMsg}
        <p class="text-xs font-medium text-red-600">{errorMsg}</p>
      {/if}

      <div class="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onclick={onClose}
          class="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!selectedFile || isUploading}
          class="cursor-pointer rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008ae6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? "Mengunggah..." : "Upload Gambar"}
        </button>
      </div>
    </form>
  </div>
</div>
