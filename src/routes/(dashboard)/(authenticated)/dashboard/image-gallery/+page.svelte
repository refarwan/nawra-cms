<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { invalidateAll } from "$app/navigation";

  import UploadImageModal from "#lib/components/media/UploadImageModal.svelte";

  import { pageTitleStore } from "../../../stores/page-title.svelte";
  import Pagination from "../../components/Pagination.svelte";
  import ImageCard from "./components/ImageCard.svelte";
  import ImageDetailModal from "./components/ImageDetailModal.svelte";
  import ImageLibraryToolbar from "./components/ImageLibraryToolbar.svelte";

  import type { PageProps } from "./$types";
  import type { ImageGalleryItem } from "./components/ImageDetailModal.svelte";

  let { data }: PageProps = $props();

  onMount(() => {
    pageTitleStore.set("Galeri Gambar");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });

  let isUploading = $state(false);
  let selectedImage = $state<ImageGalleryItem | null>(null);
  let searchQuery = $state("");
  let currentPage = $state(1);
  const perPage = 12;

  const filteredItems = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.images;
    return data.images.filter(
      (item) => item.name.toLowerCase().includes(q) || item.altText.toLowerCase().includes(q)
    );
  });

  const totalPage = $derived(Math.max(1, Math.ceil(filteredItems.length / perPage)));
  const paginatedItems = $derived(
    filteredItems.slice((currentPage - 1) * perPage, currentPage * perPage)
  );
</script>

<svelte:head>
  <title>Galeri Gambar · {data.siteSettings.siteTitle}</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <ImageLibraryToolbar
    searchValue={searchQuery}
    onSearchInput={(value) => {
      searchQuery = value;
      currentPage = 1;
    }}
    onUploadClick={() => (isUploading = true)}
  />

  {#if paginatedItems.length === 0}
    <div
      class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500"
    >
      <Icon icon="lucide:images" class="h-8 w-8 text-gray-300" />
      <span class="mt-2">
        {searchQuery ? "Tidak ada gambar yang cocok dengan pencarian." : "Belum ada gambar."}
      </span>
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {#each paginatedItems as item (item.id)}
        <ImageCard {item} onClick={() => (selectedImage = item)} />
      {/each}
    </div>
  {/if}

  {#if totalPage > 1}
    <Pagination
      page={currentPage}
      {totalPage}
      onPageChange={(pageNum) => (currentPage = pageNum)}
    />
  {/if}
</div>

{#if isUploading}
  <UploadImageModal
    onClose={() => (isUploading = false)}
    onUploaded={async () => {
      isUploading = false;
      await invalidateAll();
    }}
  />
{/if}

{#if selectedImage}
  <ImageDetailModal
    image={selectedImage}
    onClose={() => (selectedImage = null)}
    onChanged={async () => {
      selectedImage = null;
      await invalidateAll();
    }}
  />
{/if}
