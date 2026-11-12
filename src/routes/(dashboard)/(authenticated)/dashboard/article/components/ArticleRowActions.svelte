<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";

  import { popup } from "#lib/stores/popup.svelte";

  import type { ArticleRowItem } from "./ArticleTable.svelte";

  let {
    item,
    onEdit
  }: {
    item: ArticleRowItem;
    onEdit: (item: ArticleRowItem) => void;
  } = $props();

  let deleteFormEl = $state<HTMLFormElement>();
</script>

<div class="flex items-center justify-center gap-1.5">
  <button
    type="button"
    onclick={() => onEdit(item)}
    class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
    title="Ubah Info Artikel"
  >
    <Icon icon="lucide:square-pen" class="h-4 w-4" />
  </button>

  <a
    href="{resolve('/editor')}?type=article&id={item.id}"
    class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-[#0d99ff]"
    title="Desain di Visual Editor"
  >
    <Icon icon="lucide:pen-tool" class="h-4 w-4" />
  </a>

  <form bind:this={deleteFormEl} method="POST" action="?/delete" use:enhance>
    <input type="hidden" name="id" value={item.id} />
    <button
      type="button"
      onclick={() => {
        popup.confirm({
          title: "Hapus Artikel",
          message: `Hapus artikel "${item.title}"?`,
          confirmText: "Hapus",
          onConfirm: () => deleteFormEl?.requestSubmit()
        });
      }}
      class="cursor-pointer rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
      title="Hapus Artikel"
    >
      <Icon icon="lucide:trash-2" class="h-4 w-4" />
    </button>
  </form>
</div>
