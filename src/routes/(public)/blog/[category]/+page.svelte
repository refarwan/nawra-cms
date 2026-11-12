<script lang="ts">
  import BlogListView from "../components/BlogListView.svelte";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const heading = $derived(data.activeCategory ? data.activeCategory.name : "Tanpa Kategori");
  const subheading = $derived(
    data.activeCategory?.description || `Daftar artikel pada kategori ${heading}.`
  );
</script>

<svelte:head>
  <title>{heading} · Blog · {data.siteSettings.siteTitle}</title>
  <meta name="description" content={subheading} />
</svelte:head>

<BlogListView
  articles={data.articles}
  categories={data.categories}
  activeCategorySlug={data.activeCategorySlug}
  {heading}
  {subheading}
  accentColor={data.siteSettings.blogAccentColor}
  headerHtml={data.headerHtml}
  footerHtml={data.footerHtml}
  cfCountry={data.cfCountry}
/>
