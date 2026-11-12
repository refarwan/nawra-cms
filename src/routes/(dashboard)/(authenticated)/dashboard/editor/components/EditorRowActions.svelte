<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import { popup } from "#lib/stores/popup.svelte";

  import type { EditorRowItem } from "./EditorTable.svelte";

  let {
    item,
    onEdit,
    onChangePassword
  }: {
    item: EditorRowItem;
    onEdit: (item: EditorRowItem) => void;
    onChangePassword: (item: EditorRowItem) => void;
  } = $props();

  let deleteFormEl = $state<HTMLFormElement>();
</script>

<div class="flex items-center justify-center gap-1.5">
  <button
    type="button"
    onclick={() => onEdit(item)}
    class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
    title="Ubah Editor"
  >
    <Icon icon="lucide:square-pen" class="h-4 w-4" />
  </button>

  <button
    type="button"
    onclick={() => onChangePassword(item)}
    class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
    title="Ganti Kata Sandi"
  >
    <Icon icon="lucide:key-round" class="h-4 w-4" />
  </button>

  <form bind:this={deleteFormEl} method="POST" action="?/delete" use:enhance>
    <input type="hidden" name="id" value={item.id} />
    <button
      type="button"
      onclick={() => {
        popup.confirm({
          title: "Hapus Editor",
          message: `Hapus akun editor "${item.name || item.username}"? Semua artikel, kategori artikel, dan gambar yang dibuat editor ini juga akan dihapus permanen.`,
          confirmText: "Hapus",
          onConfirm: () => deleteFormEl?.requestSubmit()
        });
      }}
      class="cursor-pointer rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
      title="Hapus Editor"
    >
      <Icon icon="lucide:trash-2" class="h-4 w-4" />
    </button>
  </form>
</div>
