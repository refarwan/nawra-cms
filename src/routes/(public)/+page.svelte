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
  <title>
    {data.siteSettings.siteTagline
      ? `${data.siteSettings.siteTitle} · ${data.siteSettings.siteTagline}`
      : data.siteSettings.siteTitle}
  </title>
  {#if data.siteSettings.siteDescription || data.siteSettings.siteTagline}
    <meta
      name="description"
      content={data.siteSettings.siteDescription || data.siteSettings.siteTagline}
    />
  {/if}
</svelte:head>

<div
  class="flex min-h-screen flex-col bg-white font-sans text-gray-900 antialiased selection:bg-[#2563eb] selection:text-white"
>
  <!-- Header: Active from Cloudflare D1 or Fallback -->
  {#if data.headerHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.headerHtml}
  {:else}
    <PublicHeaderFallback cfCountry={data.cfCountry} />
  {/if}

  <!-- Main Content (Home Page): Active from Cloudflare D1 or Fallback -->
  {#if data.homeHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.homeHtml}
  {:else}
    <main class="w-full flex-1">
      <PublicHeroSection />
      <PublicFeaturesSection />
      <PublicCtaSection />
    </main>
  {/if}

  <!-- Footer: Active from Cloudflare D1 or Fallback -->
  {#if data.footerHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.footerHtml}
  {:else}
    <PublicFooterFallback />
  {/if}
</div>
