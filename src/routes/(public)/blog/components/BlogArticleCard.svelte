<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import type { PublicBlogCardItem } from "./BlogListView.svelte";

  let { item }: { item: PublicBlogCardItem } = $props();

  const formatDate = (timestamp: number): string =>
    new Date(timestamp).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
</script>

<a
  href={resolve("/(public)/blog/[category]/[slug]", {
    category: item.categorySlug,
    slug: item.slug
  })}
  class="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors hover:border-[var(--blog-accent,#0d99ff)]"
>
  {#if item.coverImage}
    <img
      src={item.coverImage}
      alt={item.title}
      class="h-44 w-full border-b border-gray-100 object-cover"
    />
  {:else}
    <div
      class="flex h-44 w-full items-center justify-center border-b border-gray-100 bg-gray-50 text-gray-300"
    >
      <Icon icon="lucide:image" class="h-8 w-8" />
    </div>
  {/if}

  <div class="flex flex-1 flex-col p-5">
    <div class="mb-2 flex items-center justify-between gap-2 text-xs text-gray-500">
      {#if item.categoryName}
        <span
          class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
          style="border-color: color-mix(in srgb, var(--blog-accent, #0d99ff) 30%, transparent); background-color: color-mix(in srgb, var(--blog-accent, #0d99ff) 10%, transparent); color: var(--blog-accent, #0d99ff);"
        >
          {item.categoryName}
        </span>
      {:else}
        <span>Artikel</span>
      {/if}
      <span>{formatDate(item.publishedAt)}</span>
    </div>

    <h2
      class="line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-[var(--blog-accent,#0d99ff)]"
    >
      {item.title}
    </h2>

    {#if item.excerpt}
      <p class="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">{item.excerpt}</p>
    {/if}
  </div>
</a>
