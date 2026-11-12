<script lang="ts">
  import Icon from "@iconify/svelte";

  import TableHeader from "../../../components/TableHeader.svelte";
  import EditorTableRow from "./EditorTableRow.svelte";

  import type { TableHeaderColumn } from "../../../components/TableHeader.svelte";

  export interface EditorRowItem {
    id: string;
    name: string | null;
    username: string;
    email: string;
    avatarUrl: string;
    createdAt: number;
    updatedAt: number;
  }

  let {
    items,
    search = "",
    onEdit,
    onChangePassword
  }: {
    items: EditorRowItem[];
    search?: string;
    onEdit: (item: EditorRowItem) => void;
    onChangePassword: (item: EditorRowItem) => void;
  } = $props();

  const columns: TableHeaderColumn[] = [
    { label: "Editor" },
    { label: "Email" },
    { label: "Tanggal", align: "center" },
    { label: "Aksi", align: "center" }
  ];
</script>

<div class="w-full">
  {#if items.length === 0}
    <div
      class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500"
    >
      <Icon icon="lucide:users" class="h-8 w-8 text-gray-300" />
      <span class="mt-2">
        {search ? "Tidak ada editor yang cocok dengan pencarian." : "Belum ada akun editor."}
      </span>
    </div>
  {:else}
    <TableHeader {columns} gridCols="grid-cols-[1fr_220px_140px_120px]" />
    <div class="flex flex-col gap-2 lg:gap-0">
      {#each items as item (item.id)}
        <EditorTableRow {item} {onEdit} {onChangePassword} />
      {/each}
    </div>
  {/if}
</div>
