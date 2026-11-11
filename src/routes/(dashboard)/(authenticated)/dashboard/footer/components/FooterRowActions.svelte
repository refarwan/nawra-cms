<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";

  import type { FooterRowItem } from "./FooterTable.svelte";

  interface Props {
    item: FooterRowItem;
    onEdit: (item: FooterRowItem) => void;
  }

  let { item, onEdit }: Props = $props();

  const isActive = $derived(item.isActive === 1);
</script>

<div class="flex items-center justify-center gap-1.5">
  {#if !isActive}
    <form method="POST" action="?/activate" use:enhance>
      <input type="hidden" name="id" value={item.id} />
      <button
        type="submit"
        class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#0d99ff] hover:bg-blue-50/50 hover:text-[#0d99ff]"
        title="Aktifkan Footer ini"
      >
        <Icon icon="lucide:power" class="h-3.5 w-3.5" />
        <span>Aktifkan</span>
      </button>
    </form>
  {:else}
    <a
      href={resolve("/(public)")}
      target="_blank"
      rel="noopener noreferrer"
      class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      title="Lihat Situs Publik"
    >
      <Icon icon="lucide:globe" class="h-4 w-4" />
    </a>
  {/if}

  <a
    href="{resolve('/editor')}?type=footer&id={item.id}"
    class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-[#0d99ff]"
    title="Desain di Visual Editor"
  >
    <Icon icon="lucide:pen-tool" class="h-4 w-4" />
  </a>

  <button
    type="button"
    onclick={() => onEdit(item)}
    class="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
    title="Ubah Judul Footer"
  >
    <Icon icon="lucide:square-pen" class="h-4 w-4" />
  </button>

  {#if !isActive}
    <form method="POST" action="?/delete" use:enhance>
      <input type="hidden" name="id" value={item.id} />
      <button
        type="submit"
        onclick={(e) => {
          if (!confirm(`Hapus footer "${item.title}"?`)) e.preventDefault();
        }}
        class="cursor-pointer rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
        title="Hapus Footer"
      >
        <Icon icon="lucide:trash-2" class="h-4 w-4" />
      </button>
    </form>
  {/if}
</div>
