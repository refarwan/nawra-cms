<script lang="ts">
  import Icon from "@iconify/svelte";

  import DropdownSelect from "../../../components/DropdownSelect.svelte";
  import Searchbar from "../../../components/Searchbar.svelte";

  import type { DropdownOption } from "../../../components/DropdownSelect.svelte";

  export interface CategoryOption {
    id: string;
    name: string;
    slug: string;
  }

  let {
    searchValue,
    categoryFilter,
    categories,
    onSearchInput,
    onCategoryChange,
    onAddClick
  }: {
    searchValue: string;
    categoryFilter: string;
    categories: CategoryOption[];
    onSearchInput: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onAddClick: () => void;
  } = $props();

  const categoryOptions = $derived<DropdownOption[]>([
    { value: "", label: "Semua Kategori" },
    { value: "uncategorized", label: "Tanpa Kategori" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name }))
  ]);
</script>

<div class="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
  <div class="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
    <Searchbar value={searchValue} onInput={onSearchInput} placeholder="Cari judul atau slug..." />

    <div class="sm:w-52">
      <DropdownSelect
        value={categoryFilter}
        options={categoryOptions}
        placeholder="Semua Kategori"
        onChange={onCategoryChange}
        triggerClass="rounded-lg py-2.5"
      />
    </div>
  </div>

  <button
    type="button"
    onclick={onAddClick}
    class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0d99ff] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008ae6]"
  >
    <Icon icon="lucide:plus" class="h-4 w-4" />
    <span>Tambah Artikel</span>
  </button>
</div>
