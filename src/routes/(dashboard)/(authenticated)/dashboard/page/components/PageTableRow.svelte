<script lang="ts">
  import { resolve } from "$app/paths";

  import PageRowActions from "./PageRowActions.svelte";

  import type { PageRowItem } from "./PageTable.svelte";

  let {
    item,
    onEdit
  }: {
    item: PageRowItem;
    onEdit: (item: PageRowItem) => void;
  } = $props();

  const isPublished = $derived(item.status === "published");

  const formatDate = (timestamp: number): string => {
    try {
      return new Date(timestamp).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "-";
    }
  };
</script>

<div
  class="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all duration-300 hover:bg-gray-50/60 lg:grid lg:grid-cols-[1fr_160px_220px] lg:items-center lg:gap-4 lg:rounded-none lg:border-t-0 lg:px-4 lg:py-3.5 lg:last:rounded-b-xl"
>
  <!-- Info (Title, Status Badge, Slug & Description) -->
  <div class="min-w-0">
    <div class="flex items-center gap-2">
      <a
        href="{resolve('/editor')}?type=page&id={item.id}"
        class="line-clamp-2 cursor-pointer text-left text-sm font-semibold text-gray-900 transition-colors hover:text-[#0d99ff] focus:outline-none"
      >
        {item.title || "Tanpa Judul"}
      </a>
      <span
        class="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold {isPublished
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-amber-200 bg-amber-50 text-amber-700'}"
      >
        {isPublished ? "Published" : "Draft"}
      </span>
    </div>

    <div class="mt-0.5 flex items-center text-xs text-gray-500">
      {#if isPublished}
        <a
          href={resolve("/(public)/[slug]", { slug: item.slug })}
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-[11px] text-gray-500 transition-colors hover:text-sky-600"
          title="Lihat Halaman Publik"
        >
          /{item.slug}
        </a>
      {:else}
        <span class="font-mono text-[11px] text-gray-500">/{item.slug}</span>
      {/if}
    </div>
  </div>

  <!-- Tanggal -->
  <div class="flex items-center gap-2 text-xs text-gray-500 lg:justify-center">
    <span class="text-[11px] text-gray-400 lg:hidden">Dibuat:</span>
    <span>{formatDate(item.createdAt)}</span>
  </div>

  <!-- Actions -->
  <div
    class="flex items-center justify-end gap-1.5 border-t border-gray-100 pt-2 lg:justify-center lg:border-t-0 lg:pt-0"
  >
    <PageRowActions {item} {onEdit} />
  </div>
</div>
