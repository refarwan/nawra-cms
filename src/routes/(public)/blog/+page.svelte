<script lang="ts">
  import BlogListView from "./components/BlogListView.svelte";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Blog · {data.siteSettings.siteTitle}</title>
  <meta
    name="description"
    content={data.siteSettings.siteTagline || "Kumpulan artikel dan informasi terbaru."}
  />
</svelte:head>

<BlogListView
  articles={data.articles}
  categories={data.categories}
  activeCategorySlug={data.activeCategorySlug}
  subheading={data.siteSettings.siteTagline || undefined}
  accentColor={data.siteSettings.blogAccentColor}
  headerHtml={data.headerHtml}
  footerHtml={data.footerHtml}
  cfCountry={data.cfCountry}
/>
