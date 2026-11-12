<script lang="ts">
  import Icon from "@iconify/svelte";

  import TableHeader from "../../../components/TableHeader.svelte";
  import CategoryTableRow from "./CategoryTableRow.svelte";

  import type { TableHeaderColumn } from "../../../components/TableHeader.svelte";

  export interface CategoryRowItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    articleCount: number;
    authorName: string | null;
    authorAvatarUrl: string | null;
    createdAt: number;
    isSystem?: boolean;
  }

  let {
    items,
    search = "",
    onEdit
  }: {
    items: CategoryRowItem[];
    search?: string;
    onEdit: (item: CategoryRowItem) => void;
  } = $props();

  const columns: TableHeaderColumn[] = [
    { label: "Kategori" },
    { label: "Jumlah Artikel", align: "center" },
    { label: "Author", align: "center" },
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
        {search ? "Tidak ada kategori yang cocok dengan pencarian." : "Belum ada kategori artikel."}
      </span>
    </div>
  {:else}
    <TableHeader {columns} gridCols="grid-cols-[minmax(0,1fr)_130px_140px_130px_130px]" />
    <div class="flex flex-col gap-2 lg:gap-0">
      {#each items as item (item.id)}
        <CategoryTableRow {item} {onEdit} />
      {/each}
    </div>
  {/if}
</div>
