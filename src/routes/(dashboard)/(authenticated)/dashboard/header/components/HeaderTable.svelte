<script lang="ts">
  import Icon from "@iconify/svelte";

  import TableHeader from "../../../components/TableHeader.svelte";
  import HeaderTableRow from "./HeaderTableRow.svelte";

  import type { TableHeaderColumn } from "../../../components/TableHeader.svelte";

  export interface HeaderRowItem {
    id: string;
    title: string;
    isActive: number;
    createdAt: number;
    updatedAt: number;
  }

  interface Props {
    items: HeaderRowItem[];
    search?: string;
    onEdit: (item: HeaderRowItem) => void;
  }

  let { items, search = "", onEdit }: Props = $props();

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
        {search ? "Tidak ada header yang cocok dengan pencarian." : "Belum ada data header."}
      </span>
    </div>
  {:else}
    <TableHeader {columns} gridCols="grid-cols-[1fr_160px_220px]" />
    <div class="flex flex-col gap-2 lg:gap-0">
      {#each items as item (item.id)}
        <HeaderTableRow {item} {onEdit} />
      {/each}
    </div>
  {/if}
</div>
