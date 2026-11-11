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

<div class="min-h-screen bg-[#0e0e10] text-neutral-100 selection:bg-[#0d99ff] selection:text-white">
  <!-- Ambient Background Glow -->
  <div class="pointer-events-none fixed inset-0 overflow-hidden">
    <div
      class="absolute -top-40 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full bg-linear-to-tr from-[#0d99ff]/15 via-[#9747ff]/15 to-transparent blur-[120px]"
    ></div>
    <div
      class="absolute top-1/2 -right-40 h-100 w-150 rounded-full bg-[#ff4785]/10 blur-[130px]"
    ></div>
  </div>

  <!-- Header: Active from Cloudflare D1 or Fallback -->
  {#if data.headerHtml}
    <div class="relative z-20 w-full">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html data.headerHtml}
    </div>
  {:else}
    <PublicHeaderFallback cfCountry={data.cfCountry} />
  {/if}

  <!-- Main Content -->
  <main class="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-24 lg:px-12">
    <PublicHeroSection />
    <PublicFeaturesSection />
    <PublicCtaSection />
  </main>

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
