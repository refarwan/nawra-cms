<script lang="ts">
  import { resolve } from "$app/paths";

  import UserAvatarBadge from "../../../components/UserAvatarBadge.svelte";
  import CategoryRowActions from "./CategoryRowActions.svelte";

  import type { CategoryRowItem } from "./CategoryTable.svelte";

  let {
    item,
    onEdit
  }: {
    item: CategoryRowItem;
    onEdit: (item: CategoryRowItem) => void;
  } = $props();

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
  class="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all duration-300 hover:bg-gray-50/60 lg:grid lg:grid-cols-[minmax(0,1fr)_130px_140px_130px_130px] lg:items-center lg:gap-4 lg:rounded-none lg:border-t-0 lg:px-4 lg:py-3.5 lg:last:rounded-b-xl"
>
  <div class="min-w-0">
    <div class="flex items-center gap-2">
      <span class="line-clamp-1 text-sm font-semibold text-gray-900">
        {item.name}
      </span>
      {#if item.isSystem}
        <span
          class="inline-flex shrink-0 items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700"
        >
          Bawaan
        </span>
      {/if}
    </div>

    <div class="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
      <a
        href={resolve("/(public)/blog/[category]", { category: item.slug })}
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-[11px] text-gray-500 transition-colors hover:text-sky-600"
        title="Lihat Kategori Publik"
      >
        /blog/{item.slug}
      </a>
      {#if item.description}
        <span class="text-gray-300">·</span>
        <span class="line-clamp-1">{item.description}</span>
      {/if}
    </div>
  </div>

  <div class="flex min-w-0 items-center gap-2 text-xs text-gray-600 lg:justify-center">
    <span class="text-[11px] text-gray-400 lg:hidden">Jumlah Artikel:</span>
    <span
      class="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700"
    >
      {item.articleCount} Artikel
    </span>
  </div>

  <div class="flex min-w-0 items-center gap-2 text-xs text-gray-600 lg:justify-center">
    <span class="text-[11px] text-gray-400 lg:hidden">Author:</span>
    <UserAvatarBadge name={item.authorName} avatarUrl={item.authorAvatarUrl} />
  </div>

  <div class="flex min-w-0 items-center gap-2 text-xs text-gray-500 lg:justify-center">
    <span class="text-[11px] text-gray-400 lg:hidden">Dibuat:</span>
    <span>{item.isSystem ? "-" : formatDate(item.createdAt)}</span>
  </div>

  <div
    class="flex items-center justify-end gap-1.5 border-t border-gray-100 pt-2 lg:justify-center lg:border-t-0 lg:pt-0"
  >
    <CategoryRowActions {item} {onEdit} />
  </div>
</div>
