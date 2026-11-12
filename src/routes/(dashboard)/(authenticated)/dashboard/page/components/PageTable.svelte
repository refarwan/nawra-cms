<script lang="ts">
  import Icon from "@iconify/svelte";

  import TableHeader from "../../../components/TableHeader.svelte";
  import PageTableRow from "./PageTableRow.svelte";

  import type { TableHeaderColumn } from "../../../components/TableHeader.svelte";

  export interface PageRowItem {
    id: string;
    title: string;
    slug: string;
    description: string;
    status: "draft" | "published";
    createdAt: number;
    updatedAt: number;
  }

  let {
    items,
    search = "",
    onEdit
  }: {
    items: PageRowItem[];
    search?: string;
    onEdit: (item: PageRowItem) => void;
  } = $props();

  const columns: TableHeaderColumn[] = [
    { label: "Judul" },
    { label: "Tanggal", align: "center" },
    { label: "Aksi", align: "center" }
  ];
</script>

<div class="w-full">
  {#if items.length === 0}
    <div
      class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500"
    >
      <Icon icon="lucide:inbox" class="h-8 w-8 text-gray-300" />
      <span class="mt-2">
        {search ? "Tidak ada halaman yang cocok dengan pencarian." : "Belum ada data halaman."}
      </span>
    </div>
  {:else}
    <TableHeader {columns} gridCols="grid-cols-[1fr_160px_220px]" />
    <div class="flex flex-col gap-2 lg:gap-0">
      {#each items as item (item.id)}
        <PageTableRow {item} {onEdit} />
      {/each}
    </div>
  {/if}
</div>
