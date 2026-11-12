<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";

  import { popup } from "#lib/stores/popup.svelte";

  import type { HomeRowItem } from "./HomeTable.svelte";

  interface Props {
    item: HomeRowItem;
    onEdit: (item: HomeRowItem) => void;
  }

  let { item, onEdit }: Props = $props();

  let deleteFormEl = $state<HTMLFormElement>();
  const isActive = $derived(item.isActive === 1);
</script>

<div class="flex items-center justify-center gap-1.5">
  <button
    type="button"
    onclick={() => onEdit(item)}
    class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
    title="Ubah Judul Laman Utama"
  >
    <Icon icon="lucide:square-pen" class="h-4 w-4" />
  </button>

  <a
    href="{resolve('/editor')}?type=homepage&id={item.id}"
    class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-[#0d99ff]"
    title="Desain di Visual Editor"
  >
    <Icon icon="lucide:pen-tool" class="h-4 w-4" />
  </a>

  <form bind:this={deleteFormEl} method="POST" action="?/delete" use:enhance>
    <input type="hidden" name="id" value={item.id} />
    <button
      type="button"
      disabled={isActive}
      onclick={() => {
        if (isActive) return;
        popup.confirm({
          title: "Hapus Laman Utama",
          message: `Hapus laman utama "${item.title}"?`,
          confirmText: "Hapus",
          onConfirm: () => deleteFormEl?.requestSubmit()
        });
      }}
      class="rounded-lg p-1.5 transition-colors {isActive
        ? 'cursor-not-allowed text-gray-300'
        : 'cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-700'}"
      title={isActive ? "Laman Utama aktif tidak dapat dihapus" : "Hapus Laman Utama"}
    >
      <Icon icon="lucide:trash-2" class="h-4 w-4" />
    </button>
  </form>
</div>
