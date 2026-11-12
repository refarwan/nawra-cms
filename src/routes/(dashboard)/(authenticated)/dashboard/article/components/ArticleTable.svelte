<script lang="ts">
  import Icon from "@iconify/svelte";

  import TableHeader from "../../../components/TableHeader.svelte";
  import ArticleTableRow from "./ArticleTableRow.svelte";

  import type { TableHeaderColumn } from "../../../components/TableHeader.svelte";

  export interface ArticleRowItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    categoryId: string | null;
    categoryName: string | null;
    categorySlug: string;
    authorName: string | null;
    authorAvatarUrl: string | null;
    status: "draft" | "published";
    createdAt: number;
    updatedAt: number;
  }

  let {
    items,
    search = "",
    onEdit
  }: {
    items: ArticleRowItem[];
    search?: string;
    onEdit: (item: ArticleRowItem) => void;
  } = $props();

  const columns: TableHeaderColumn[] = [
    { label: "Judul" },
    { label: "Kategori", align: "center" },
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
        {search ? "Tidak ada artikel yang cocok dengan pencarian." : "Belum ada data artikel."}
      </span>
    </div>
  {:else}
    <TableHeader {columns} gridCols="grid-cols-[minmax(0,1fr)_120px_120px_110px_120px]" />
    <div class="flex flex-col gap-2 lg:gap-0">
      {#each items as item (item.id)}
        <ArticleTableRow {item} {onEdit} />
      {/each}
    </div>
  {/if}
</div>
