<script lang="ts">
  import PublicFooterFallback from "../components/PublicFooterFallback.svelte";
  import PublicHeaderFallback from "../components/PublicHeaderFallback.svelte";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.page.title} · {data.siteSettings.siteTitle}</title>
  <meta name="description" content={data.page.description || data.page.title} />
</svelte:head>

<div
  class="flex min-h-screen flex-col bg-white font-sans text-gray-900 antialiased selection:bg-[#2563eb] selection:text-white"
>
  {#if data.headerHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.headerHtml}
  {:else}
    <PublicHeaderFallback cfCountry={data.cfCountry} />
  {/if}

  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html data.page.contentHtml}

  {#if data.footerHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.footerHtml}
  {:else}
    <PublicFooterFallback />
  {/if}
</div>
