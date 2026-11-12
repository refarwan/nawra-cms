<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import { popup } from "#lib/stores/popup.svelte";

  import type { CategoryRowItem } from "./CategoryTable.svelte";

  let {
    item,
    onEdit
  }: {
    item: CategoryRowItem;
    onEdit: (item: CategoryRowItem) => void;
  } = $props();

  let deleteFormEl = $state<HTMLFormElement>();
</script>

{#if item.isSystem}
  <span class="text-xs text-gray-400">-</span>
{:else}
  <div class="flex items-center justify-center gap-1.5">
    <button
      type="button"
      onclick={() => onEdit(item)}
      class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      title="Ubah Kategori"
    >
      <Icon icon="lucide:square-pen" class="h-4 w-4" />
    </button>

    <form bind:this={deleteFormEl} method="POST" action="?/delete" use:enhance>
      <input type="hidden" name="id" value={item.id} />
      <button
        type="button"
        onclick={() => {
          popup.confirm({
            title: "Hapus Kategori",
            message: `Hapus kategori "${item.name}"? Artikel dalam kategori ini akan dipindahkan ke Tanpa Kategori.`,
            confirmText: "Hapus",
            onConfirm: () => deleteFormEl?.requestSubmit()
          });
        }}
        class="cursor-pointer rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
        title="Hapus Kategori"
      >
        <Icon icon="lucide:trash-2" class="h-4 w-4" />
      </button>
    </form>
  </div>
{/if}
