<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { pageTitleStore } from "../../../stores/page-title.svelte";
  import Pagination from "../../components/Pagination.svelte";
  import ArticleTable from "./components/ArticleTable.svelte";
  import ArticleToolbar from "./components/ArticleToolbar.svelte";
  import CreateArticleModal from "./components/CreateArticleModal.svelte";
  import EditArticleModal from "./components/EditArticleModal.svelte";

  import type { ActionData, PageProps } from "./$types";
  import type { ArticleRowItem } from "./components/ArticleTable.svelte";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  onMount(() => {
    pageTitleStore.set("Daftar Artikel");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });

  let isCreating = $state(false);
  let editingArticle = $state<ArticleRowItem | null>(null);
  let searchQuery = $state("");
  let selectedCategoryId = $state("");
  let currentPage = $state(1);
  const perPage = 10;

  const filteredItems = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.articles.filter((item) => {
      if (selectedCategoryId === "uncategorized") {
        if (item.categoryId) return false;
      } else if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        (item.categoryName?.toLowerCase().includes(q) ?? false)
      );
    });
  });

  const totalPage = $derived(Math.max(1, Math.ceil(filteredItems.length / perPage)));
  const paginatedItems = $derived(
    filteredItems.slice((currentPage - 1) * perPage, currentPage * perPage)
  );
</script>

<svelte:head>
  <title>Daftar Artikel · {data.siteSettings.siteTitle}</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <ArticleToolbar
    searchValue={searchQuery}
    categoryFilter={selectedCategoryId}
    categories={data.categories}
    onSearchInput={(value) => {
      searchQuery = value;
      currentPage = 1;
    }}
    onCategoryChange={(value) => {
      selectedCategoryId = value;
      currentPage = 1;
    }}
    onAddClick={() => (isCreating = true)}
  />

  {#if form?.error}
    <div
      class="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
    >
      <Icon icon="lucide:alert-circle" class="h-4 w-4 shrink-0 text-red-500" />
      <span>{form.error}</span>
    </div>
  {/if}

  <ArticleTable
    items={paginatedItems}
    search={searchQuery}
    onEdit={(item) => (editingArticle = item)}
  />

  {#if totalPage > 1}
    <Pagination
      page={currentPage}
      {totalPage}
      onPageChange={(pageNum) => (currentPage = pageNum)}
    />
  {/if}
</div>

{#if isCreating}
  <CreateArticleModal categories={data.categories} onClose={() => (isCreating = false)} />
{/if}

{#if editingArticle}
  <EditArticleModal
    article={editingArticle}
    categories={data.categories}
    onClose={() => (editingArticle = null)}
  />
{/if}
