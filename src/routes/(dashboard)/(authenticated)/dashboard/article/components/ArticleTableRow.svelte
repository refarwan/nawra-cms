<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import UserAvatarBadge from "../../../components/UserAvatarBadge.svelte";
  import ArticleRowActions from "./ArticleRowActions.svelte";

  import type { ArticleRowItem } from "./ArticleTable.svelte";

  let {
    item,
    onEdit
  }: {
    item: ArticleRowItem;
    onEdit: (item: ArticleRowItem) => void;
  } = $props();

  const isPublished = $derived(item.status === "published");

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
  class="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all duration-300 hover:bg-gray-50/60 lg:grid lg:grid-cols-[minmax(0,1fr)_120px_120px_110px_120px] lg:items-center lg:gap-4 lg:rounded-none lg:border-t-0 lg:px-4 lg:py-3.5 lg:last:rounded-b-xl"
>
  <div class="flex min-w-0 items-center gap-3">
    <a
      href="{resolve('/editor')}?type=article&id={item.id}"
      class="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
      title={item.title || "Tanpa Judul"}
    >
      {#if item.coverImage}
        <img
          src={item.coverImage}
          alt={item.title || "Thumbnail artikel"}
          class="h-full w-full object-cover"
          loading="lazy"
        />
      {:else}
        <Icon icon="lucide:image" class="h-4 w-4 text-gray-300" />
      {/if}
    </a>

    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <a
          href="{resolve('/editor')}?type=article&id={item.id}"
          class="line-clamp-2 cursor-pointer text-left text-sm font-semibold text-gray-900 transition-colors hover:text-[#0d99ff] focus:outline-none"
        >
          {item.title || "Tanpa Judul"}
        </a>
        <span
          class="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold {isPublished
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-amber-200 bg-amber-50 text-amber-700'}"
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      </div>

      <div class="mt-0.5 flex min-w-0 items-center text-xs text-gray-500">
        {#if isPublished}
          <a
            href={resolve("/(public)/blog/[category]/[slug]", {
              category: item.categorySlug,
              slug: item.slug
            })}
            target="_blank"
            rel="noopener noreferrer"
            class="truncate font-mono text-[11px] text-gray-500 transition-colors hover:text-sky-600"
            title="Lihat Artikel Publik"
          >
            /blog/{item.categorySlug}/{item.slug}
          </a>
        {:else}
          <span class="truncate font-mono text-[11px] text-gray-500">
            /blog/{item.categorySlug}/{item.slug}
          </span>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex min-w-0 items-center gap-2 text-xs text-gray-600 lg:justify-center">
    <span class="text-[11px] text-gray-400 lg:hidden">Kategori:</span>
    {#if item.categoryName}
      <span
        class="inline-flex max-w-full items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700"
      >
        <span class="truncate">{item.categoryName}</span>
      </span>
    {:else}
      <span class="text-gray-400">-</span>
    {/if}
  </div>

  <div class="flex min-w-0 items-center gap-2 text-xs text-gray-600 lg:justify-center">
    <span class="text-[11px] text-gray-400 lg:hidden">Author:</span>
    <UserAvatarBadge name={item.authorName} avatarUrl={item.authorAvatarUrl} />
  </div>

  <div
    class="flex min-w-0 items-center gap-2 text-xs whitespace-nowrap text-gray-500 lg:justify-center"
  >
    <span class="text-[11px] text-gray-400 lg:hidden">Dibuat:</span>
    <span>{formatDate(item.createdAt)}</span>
  </div>

  <div
    class="flex items-center justify-end gap-1.5 border-t border-gray-100 pt-2 lg:justify-center lg:border-t-0 lg:pt-0"
  >
    <ArticleRowActions {item} {onEdit} />
  </div>
</div>
