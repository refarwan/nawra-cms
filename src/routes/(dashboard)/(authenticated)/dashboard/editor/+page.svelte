<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { pageTitleStore } from "../../../stores/page-title.svelte";
  import Pagination from "../../components/Pagination.svelte";
  import ChangeEditorPasswordModal from "./components/ChangeEditorPasswordModal.svelte";
  import CreateEditorModal from "./components/CreateEditorModal.svelte";
  import EditEditorModal from "./components/EditEditorModal.svelte";
  import EditorTable from "./components/EditorTable.svelte";
  import EditorToolbar from "./components/EditorToolbar.svelte";

  import type { ActionData, PageProps } from "./$types";
  import type { EditorRowItem } from "./components/EditorTable.svelte";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  onMount(() => {
    pageTitleStore.set("Daftar Editor");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });

  let isCreating = $state(false);
  let editingEditor = $state<EditorRowItem | null>(null);
  let changingPasswordEditor = $state<EditorRowItem | null>(null);
  let searchQuery = $state("");
  let currentPage = $state(1);
  const perPage = 10;

  const filteredItems = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.editors;
    return data.editors.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(q) ||
        item.username.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q)
    );
  });

  const totalPage = $derived(Math.max(1, Math.ceil(filteredItems.length / perPage)));
  const paginatedItems = $derived(
    filteredItems.slice((currentPage - 1) * perPage, currentPage * perPage)
  );
</script>

<svelte:head>
  <title>Daftar Editor · {data.siteSettings.siteTitle}</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <EditorToolbar
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

  <EditorTable
    items={paginatedItems}
    search={searchQuery}
    onEdit={(item) => (editingEditor = item)}
    onChangePassword={(item) => (changingPasswordEditor = item)}
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
  <CreateEditorModal onClose={() => (isCreating = false)} />
{/if}

{#if editingEditor}
  <EditEditorModal editor={editingEditor} onClose={() => (editingEditor = null)} />
{/if}

{#if changingPasswordEditor}
  <ChangeEditorPasswordModal
    editor={changingPasswordEditor}
    onClose={() => (changingPasswordEditor = null)}
  />
{/if}
