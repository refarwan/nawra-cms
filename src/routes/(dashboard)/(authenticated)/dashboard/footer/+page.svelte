<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { pageTitleStore } from "../../../stores/page-title.svelte";
  import Pagination from "../../components/Pagination.svelte";
  import CreateFooterModal from "./components/CreateFooterModal.svelte";
  import EditFooterModal from "./components/EditFooterModal.svelte";
  import FooterTable from "./components/FooterTable.svelte";
  import FooterToolbar from "./components/FooterToolbar.svelte";

  import type { ActionData, PageProps } from "./$types";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  onMount(() => {
    pageTitleStore.set("Kelola Footer");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });

  let isCreating = $state(false);
  let editingFooter = $state<{ id: string; title: string } | null>(null);
  let searchQuery = $state("");
  let currentPage = $state(1);
  const perPage = 10;

  const filteredItems = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.footers;
    return data.footers.filter(
      (item) => item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    );
  });

  const totalPage = $derived(Math.max(1, Math.ceil(filteredItems.length / perPage)));
  const paginatedItems = $derived(
    filteredItems.slice((currentPage - 1) * perPage, currentPage * perPage)
  );

  const handleSearchInput = (value: string) => {
    searchQuery = value;
    currentPage = 1;
  };
</script>

<svelte:head>
  <title>Kelola Footer · Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <FooterToolbar
    searchValue={searchQuery}
    onSearchInput={handleSearchInput}
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

  <FooterTable
    items={paginatedItems}
    search={searchQuery}
    onEdit={(item) => (editingFooter = { id: item.id, title: item.title })}
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
  <CreateFooterModal onClose={() => (isCreating = false)} />
{/if}

{#if editingFooter}
  <EditFooterModal footer={editingFooter} onClose={() => (editingFooter = null)} />
{/if}
