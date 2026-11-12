<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";

  import HomeRowActions from "./HomeRowActions.svelte";

  import type { HomeRowItem } from "./HomeTable.svelte";

  interface Props {
    item: HomeRowItem;
    onEdit: (item: HomeRowItem) => void;
  }

  let { item, onEdit }: Props = $props();

  const isActive = $derived(item.isActive === 1);

  const formatDate = (timestamp: number): string => {
    try {
      return new Date(timestamp).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "-";
    }
  };
</script>

<div
  class="group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all duration-300 hover:bg-gray-50/60 lg:grid lg:grid-cols-[1fr_160px_220px] lg:items-center lg:gap-4 lg:rounded-none lg:border-t-0 lg:px-4 lg:py-3.5 lg:last:rounded-b-xl"
>
  <!-- Info (Title) -->
  <div class="min-w-0">
    <div class="flex items-center gap-2">
      <a
        href="{resolve('/editor')}?type=homepage&id={item.id}"
        class="line-clamp-2 cursor-pointer text-left text-sm font-semibold text-gray-900 transition-colors hover:text-[#0d99ff] focus:outline-none"
      >
        {item.title || "Tanpa Judul"}
      </a>
      {#if isActive}
        <span
          class="inline-flex shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
        >
          Aktif
        </span>
      {:else}
        <form
          method="POST"
          action="?/activate"
          use:enhance
          class="inline-flex shrink-0 transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100"
        >
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            class="inline-flex cursor-pointer items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-600 transition-colors hover:border-[#0d99ff] hover:bg-blue-50 hover:text-[#0d99ff]"
            title="Aktifkan Laman Utama ini"
          >
            <Icon icon="lucide:power" class="h-2.5 w-2.5" />
            <span>Aktifkan</span>
          </button>
        </form>
      {/if}
    </div>
  </div>

  <!-- Tanggal -->
  <div class="flex items-center gap-2 text-xs text-gray-500 lg:justify-center">
    <span class="text-[11px] text-gray-400 lg:hidden">Dibuat:</span>
    <span>{formatDate(item.createdAt)}</span>
  </div>

  <!-- Actions -->
  <div
    class="flex items-center justify-end gap-1.5 border-t border-gray-100 pt-2 lg:justify-center lg:border-t-0 lg:pt-0"
  >
    <HomeRowActions {item} {onEdit} />
  </div>
</div>
