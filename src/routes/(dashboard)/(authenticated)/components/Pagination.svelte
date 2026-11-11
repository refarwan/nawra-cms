<script lang="ts">
  interface Props {
    page: number;
    totalPage: number;
    prevLabel?: string;
    nextLabel?: string;
    onPageChange: (page: number) => void;
  }

  let {
    page,
    totalPage,
    prevLabel = "Sebelumnya",
    nextLabel = "Berikutnya",
    onPageChange
  }: Props = $props();

  type PageEntry = number | "...";

  const getPageNumbers = (currentPage: number, totalPages: number): PageEntry[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = $derived(getPageNumbers(page, totalPage));
</script>

<div class="flex w-full items-center justify-between gap-2 pt-4 select-none">
  <button
    type="button"
    disabled={page <= 1}
    onclick={() => onPageChange(page - 1)}
    class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100/80 disabled:text-gray-400 md:px-4"
  >
    {prevLabel}
  </button>

  <div class="flex items-center gap-1 overflow-x-auto py-1 md:gap-1.5">
    {#each pages as entry, index (`${entry}-${index}`)}
      {#if entry === "..."}
        <span class="px-2 py-2 text-sm font-medium text-gray-900 md:px-3">...</span>
      {:else}
        <button
          type="button"
          onclick={() => onPageChange(entry)}
          aria-current={entry === page ? "page" : undefined}
          class={`flex h-9 min-w-8 cursor-pointer items-center justify-center rounded-lg px-2.5 py-2 text-sm transition-colors md:min-w-9 md:px-3 ${
            entry === page
              ? "bg-[#0d99ff] font-semibold text-white"
              : "font-medium text-gray-900 hover:bg-gray-100"
          }`}
        >
          {entry}
        </button>
      {/if}
    {/each}
  </div>

  <button
    type="button"
    disabled={page >= totalPage}
    onclick={() => onPageChange(page + 1)}
    class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100/80 disabled:text-gray-400 md:px-4"
  >
    {nextLabel}
  </button>
</div>
