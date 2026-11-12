<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { pageTitleStore } from "../../../stores/page-title.svelte";
  import Pagination from "../../components/Pagination.svelte";
  import CreatePageModal from "./components/CreatePageModal.svelte";
  import EditPageModal from "./components/EditPageModal.svelte";
  import PageTable from "./components/PageTable.svelte";
  import PageToolbar from "./components/PageToolbar.svelte";

  import type { ActionData, PageProps } from "./$types";
  import type { PageRowItem } from "./components/PageTable.svelte";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  onMount(() => {
    pageTitleStore.set("Kelola Halaman");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });

  let isCreating = $state(false);
  let editingPage = $state<PageRowItem | null>(null);
  let searchQuery = $state("");
  let currentPage = $state(1);
  const perPage = 10;

  const filteredItems = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.pages;
    return data.pages.filter(
      (item) => item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
    );
  });

  const totalPage = $derived(Math.max(1, Math.ceil(filteredItems.length / perPage)));
  const paginatedItems = $derived(
    filteredItems.slice((currentPage - 1) * perPage, currentPage * perPage)
  );
</script>

<svelte:head>
  <title>Kelola Halaman · {data.siteSettings.siteTitle}</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <PageToolbar
    searchValue={searchQuery}
    onSearchInput={(value) => {
      searchQuery = value;
      currentPage = 1;
    }}
    onAddClick={() => (isCreating = true)}
  />

  {#if form?.error && !("fieldErrors" in form && form.fieldErrors)}
    <div
      class="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
    >
      <Icon icon="lucide:alert-circle" class="h-4 w-4 shrink-0 text-red-500" />
      <span>{form.error}</span>
    </div>
  {/if}

  <PageTable items={paginatedItems} search={searchQuery} onEdit={(item) => (editingPage = item)} />

  {#if totalPage > 1}
    <Pagination
      page={currentPage}
      {totalPage}
      onPageChange={(pageNum) => (currentPage = pageNum)}
    />
  {/if}
</div>

{#if isCreating}
  <CreatePageModal onClose={() => (isCreating = false)} />
{/if}

{#if editingPage}
  <EditPageModal pageItem={editingPage} onClose={() => (editingPage = null)} />
{/if}
