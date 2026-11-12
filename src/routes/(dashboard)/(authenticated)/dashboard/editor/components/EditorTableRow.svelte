<script lang="ts">
  import EditorRowActions from "./EditorRowActions.svelte";

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

  const initial = $derived(
    (item.name || item.username || "E").trim().charAt(0).toUpperCase() || "E"
  );

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
  class="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all duration-300 hover:bg-gray-50/60 lg:grid lg:grid-cols-[1fr_220px_140px_120px] lg:items-center lg:gap-4 lg:rounded-none lg:border-t-0 lg:px-4 lg:py-3.5 lg:last:rounded-b-xl"
>
  <div class="flex min-w-0 items-center gap-3">
    {#if item.avatarUrl}
      <img
        src={item.avatarUrl}
        alt={item.name || item.username}
        class="h-9 w-9 shrink-0 rounded-full border border-gray-200 object-cover"
        loading="lazy"
      />
    {:else}
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600"
      >
        {initial}
      </div>
    {/if}

    <div class="min-w-0">
      <div class="truncate text-sm font-semibold text-gray-900">
        {item.name || item.username}
      </div>
      <div class="truncate font-mono text-[11px] text-gray-500">@{item.username}</div>
    </div>
  </div>

  <div class="flex items-center gap-2 truncate text-xs text-gray-600">
    <span class="text-[11px] text-gray-400 lg:hidden">Email:</span>
    <span class="truncate">{item.email}</span>
  </div>

  <div class="flex items-center gap-2 text-xs text-gray-500 lg:justify-center">
    <span class="text-[11px] text-gray-400 lg:hidden">Dibuat:</span>
    <span>{formatDate(item.createdAt)}</span>
  </div>

  <div
    class="flex items-center justify-end gap-1.5 border-t border-gray-100 pt-2 lg:justify-center lg:border-t-0 lg:pt-0"
  >
    <EditorRowActions {item} {onEdit} {onChangePassword} />
  </div>
</div>
