<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import PublicFooterFallback from "../../components/PublicFooterFallback.svelte";
  import PublicHeaderFallback from "../../components/PublicHeaderFallback.svelte";
  import BlogArticleCard from "./BlogArticleCard.svelte";

  export interface PublicBlogCardItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    publishedAt: number;
    categorySlug: string;
    categoryName: string | null;
  }

  export interface PublicCategoryPill {
    id: string;
    name: string;
    slug: string;
  }

  let {
    articles,
    categories,
    activeCategorySlug = "",
    heading = "Blog & Artikel",
    subheading = "Temukan tulisan, panduan, dan pembaruan terbaru berdasarkan kategori pilihan.",
    accentColor = "#0d99ff",
    headerHtml,
    footerHtml,
    cfCountry
  }: {
    articles: PublicBlogCardItem[];
    categories: PublicCategoryPill[];
    activeCategorySlug?: string;
    heading?: string;
    subheading?: string;
    accentColor?: string;
    headerHtml: string | null;
    footerHtml: string | null;
    cfCountry: string;
  } = $props();

  let searchQuery = $state("");

  const filteredArticles = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        (item.categoryName?.toLowerCase().includes(q) ?? false)
    );
  });
</script>

<div
  style="--blog-accent: {accentColor};"
  class="flex min-h-screen flex-col bg-white font-sans text-gray-900 antialiased selection:bg-[var(--blog-accent)] selection:text-white"
>
  {#if headerHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html headerHtml}
  {:else}
    <PublicHeaderFallback {cfCountry} />
  {/if}

  <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{heading}</h1>
      <p class="max-w-2xl text-sm text-gray-600 sm:text-base">{subheading}</p>

      <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        {#if categories.length > 0}
          <div class="flex flex-wrap items-center gap-2">
            <a
              href={resolve("/(public)/blog")}
              style={!activeCategorySlug
                ? "border-color: var(--blog-accent); background-color: color-mix(in srgb, var(--blog-accent) 10%, transparent); color: var(--blog-accent);"
                : undefined}
              class="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors {!activeCategorySlug
                ? ''
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}"
            >
              Semua
            </a>
            {#each categories as cat (cat.id)}
              <a
                href={resolve("/(public)/blog/[category]", { category: cat.slug })}
                style={activeCategorySlug === cat.slug
                  ? "border-color: var(--blog-accent); background-color: color-mix(in srgb, var(--blog-accent) 10%, transparent); color: var(--blog-accent);"
                  : undefined}
                class="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors {activeCategorySlug ===
                cat.slug
                  ? ''
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}"
              >
                {cat.name}
              </a>
            {/each}
          </div>
        {/if}

        <div class="relative w-full sm:w-72">
          <Icon
            icon="lucide:search"
            class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            bind:value={searchQuery}
            placeholder="Cari artikel..."
            aria-label="Cari artikel"
            class="w-full rounded-xl border border-gray-200 bg-white py-2 pr-9 pl-10 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[var(--blog-accent)] focus:outline-none"
          />
          {#if searchQuery}
            <button
              type="button"
              onclick={() => (searchQuery = "")}
              aria-label="Hapus pencarian"
              class="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Icon icon="lucide:x" class="h-3.5 w-3.5" />
            </button>
          {/if}
        </div>
      </div>
    </div>

    {#if filteredArticles.length === 0}
      <div
        class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50/50 py-20 text-center"
      >
        <Icon icon="lucide:newspaper" class="h-10 w-10 text-gray-300" />
        <p class="mt-3 text-sm font-medium text-gray-600">
          {searchQuery.trim()
            ? "Tidak ada artikel yang cocok dengan pencarian."
            : "Belum ada artikel yang diterbitkan."}
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each filteredArticles as item (item.id)}
          <BlogArticleCard {item} />
        {/each}
      </div>
    {/if}
  </main>

  {#if footerHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html footerHtml}
  {:else}
    <PublicFooterFallback />
  {/if}
</div>
