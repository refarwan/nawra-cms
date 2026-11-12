<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import PublicFooterFallback from "../../../components/PublicFooterFallback.svelte";
  import PublicHeaderFallback from "../../../components/PublicHeaderFallback.svelte";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const formattedDate = $derived(
    new Date(data.article.publishedAt).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  );
</script>

<svelte:head>
  <title>{data.article.title} · {data.siteSettings.siteTitle}</title>
  <meta name="description" content={data.article.excerpt || data.article.title} />
</svelte:head>

<div
  style="--blog-accent: {data.siteSettings.blogAccentColor};"
  class="flex min-h-screen flex-col bg-white font-sans text-gray-900 antialiased selection:bg-[var(--blog-accent)] selection:text-white"
>
  {#if data.headerHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.headerHtml}
  {:else}
    <PublicHeaderFallback cfCountry={data.cfCountry} />
  {/if}

  <div class="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6">
    <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
      <a
        href={resolve("/(public)/blog")}
        class="inline-flex items-center gap-1 font-semibold hover:text-[var(--blog-accent)]"
      >
        <Icon icon="lucide:arrow-left" class="h-3.5 w-3.5" />
        <span>Blog</span>
      </a>
      <span>/</span>
      <a
        href={resolve("/(public)/blog/[category]", { category: data.article.category.slug })}
        class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-opacity hover:opacity-80"
        style="border-color: color-mix(in srgb, var(--blog-accent) 30%, transparent); background-color: color-mix(in srgb, var(--blog-accent) 10%, transparent); color: var(--blog-accent);"
      >
        {data.article.category.name}
      </a>
      <span>·</span>
      <span>{formattedDate}</span>
    </div>

    <h1 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
      {data.article.title}
    </h1>

    {#if data.article.excerpt}
      <p class="mt-2 text-base text-gray-600">{data.article.excerpt}</p>
    {/if}

    {#if data.article.coverImage}
      <img
        src={data.article.coverImage}
        alt={data.article.title}
        class="mt-6 max-h-96 w-full rounded-2xl border border-gray-200 object-cover"
      />
    {/if}
  </div>

  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html data.article.contentHtml}

  {#if data.footerHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.footerHtml}
  {:else}
    <PublicFooterFallback />
  {/if}
</div>
