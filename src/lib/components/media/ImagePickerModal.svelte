<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import UploadImageModal from "./UploadImageModal.svelte";

  import type { ImageLibraryItem } from "#db/schema";

  let {
    onClose,
    onSelect
  }: {
    onClose: () => void;
    onSelect: (image: ImageLibraryItem) => void;
  } = $props();

  let images = $state<ImageLibraryItem[]>([]);
  let search = $state("");
  let isLoading = $state(true);
  let showUpload = $state(false);

  const loadImages = async () => {
    isLoading = true;
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = (await res.json()) as { images?: ImageLibraryItem[] };
        images = data.images ?? [];
      }
    } finally {
      isLoading = false;
    }
  };

  onMount(loadImages);

  const filtered = $derived.by(() => {
    const q = search.trim().toLowerCase();
    if (!q) return images;
    return images.filter(
      (img) => img.name.toLowerCase().includes(q) || img.altText.toLowerCase().includes(q)
    );
  });
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
>
  <div
    class="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-gray-200 bg-white"
  >
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
      <div class="flex items-center gap-2.5">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#0d99ff]"
        >
          <Icon icon="lucide:images" class="h-4 w-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">Pilih Gambar dari Galeri</h3>
          <p class="text-[11px] text-gray-500">Klik gambar untuk menggunakannya</p>
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

    <div
      class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-3"
    >
      <input
        type="text"
        bind:value={search}
        placeholder="Cari nama gambar..."
        class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#0d99ff] focus:outline-none sm:max-w-xs"
      />
      <button
        type="button"
        onclick={() => (showUpload = true)}
        class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#0d99ff] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#008ae6]"
      >
        <Icon icon="lucide:upload" class="h-3.5 w-3.5" />
        <span>Upload Baru</span>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6">
      {#if isLoading}
        <div class="py-16 text-center text-sm text-gray-500">Memuat galeri gambar...</div>
      {:else if filtered.length === 0}
        <div class="py-16 text-center text-sm text-gray-500">
          {search ? "Tidak ada gambar yang cocok." : "Belum ada gambar di galeri."}
        </div>
      {:else}
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {#each filtered as img (img.id)}
            <button
              type="button"
              onclick={() => onSelect(img)}
              class="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition-colors hover:border-[#0d99ff]"
            >
              <div class="aspect-square w-full overflow-hidden bg-gray-50">
                <img
                  src={img.url}
                  alt={img.altText || img.name}
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div class="p-2">
                <p class="truncate text-xs font-semibold text-gray-800">{img.name}</p>
                <p class="text-[10px] text-gray-400">
                  {img.width}×{img.height}
                </p>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

{#if showUpload}
  <UploadImageModal
    onClose={() => (showUpload = false)}
    onUploaded={(img) => {
      showUpload = false;
      images = [img, ...images];
      onSelect(img);
    }}
  />
{/if}
