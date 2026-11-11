<script lang="ts">
  import PublicCtaSection from "./components/PublicCtaSection.svelte";
  import PublicFeaturesSection from "./components/PublicFeaturesSection.svelte";
  import PublicFooterFallback from "./components/PublicFooterFallback.svelte";
  import PublicHeaderFallback from "./components/PublicHeaderFallback.svelte";
  import PublicHeroSection from "./components/PublicHeroSection.svelte";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Nawra CMS — Visual No-Code Canvas Studio</title>
</svelte:head>

<div
  class="flex min-h-screen flex-col bg-white text-gray-900 selection:bg-[#0d99ff] selection:text-white"
>
  <!-- Header: Active from Cloudflare D1 or Fallback -->
  {#if data.headerHtml}
    <div class="relative z-20 w-full">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html data.headerHtml}
    </div>
  {:else}
    <PublicHeaderFallback cfCountry={data.cfCountry} />
  {/if}

  <!-- Main Content (Home Page): Active from Cloudflare D1 or Fallback -->
  {#if data.homeHtml}
    <main class="relative z-10 w-full flex-1">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html data.homeHtml}
    </main>
  {:else}
    <main class="relative z-10 mx-auto max-w-6xl flex-1 px-6 pt-16 pb-24 lg:px-12">
      <PublicHeroSection />
      <PublicFeaturesSection />
      <PublicCtaSection />
    </main>
  {/if}

  <!-- Footer: Active from Cloudflare D1 or Fallback -->
  {#if data.footerHtml}
    <div class="relative z-10 w-full">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html data.footerHtml}
    </div>
  {:else}
    <PublicFooterFallback />
  {/if}
</div>
