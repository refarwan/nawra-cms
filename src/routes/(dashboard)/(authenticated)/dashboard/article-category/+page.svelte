<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { pageTitleStore } from "../../../stores/page-title.svelte";
  import Pagination from "../../components/Pagination.svelte";
  import CategoryTable from "./components/CategoryTable.svelte";
  import CategoryToolbar from "./components/CategoryToolbar.svelte";
  import CreateCategoryModal from "./components/CreateCategoryModal.svelte";
  import EditCategoryModal from "./components/EditCategoryModal.svelte";

  import type { ActionData, PageProps } from "./$types";
  import type { CategoryRowItem } from "./components/CategoryTable.svelte";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  onMount(() => {
    pageTitleStore.set("Kategori Artikel");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });

  let isCreating = $state(false);
  let editingCategory = $state<CategoryRowItem | null>(null);
  let searchQuery = $state("");
  let currentPage = $state(1);
  const perPage = 10;

  const filteredItems = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.categories;
    return data.categories.filter(
      (item) => item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
    );
  });

  const totalPage = $derived(Math.max(1, Math.ceil(filteredItems.length / perPage)));
  const paginatedItems = $derived(
    filteredItems.slice((currentPage - 1) * perPage, currentPage * perPage)
  );
</script>

<svelte:head>
  <title>Kategori Artikel · {data.siteSettings.siteTitle}</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <CategoryToolbar
    searchValue={searchQuery}
    onSearchInput={(value) => {
      searchQuery = value;
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

  <CategoryTable
    items={paginatedItems}
    search={searchQuery}
    onEdit={(item) => (editingCategory = item)}
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
  <CreateCategoryModal onClose={() => (isCreating = false)} />
{/if}

{#if editingCategory}
  <EditCategoryModal category={editingCategory} onClose={() => (editingCategory = null)} />
{/if}
