<script lang="ts">
  import Icon from "@iconify/svelte";

  import Searchbar from "../../../components/Searchbar.svelte";

  interface Props {
    searchValue: string;
    onSearchInput: (value: string) => void;
    onAddClick: () => void;
  }

  let { searchValue, onSearchInput, onAddClick }: Props = $props();
</script>

<div class="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
  <Searchbar value={searchValue} onInput={onSearchInput} placeholder="Cari judul header..." />

  <button
    type="button"
    onclick={onAddClick}
    class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0d99ff] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008ae6]"
  >
    <Icon icon="lucide:plus" class="h-4 w-4" />
    <span>Tambah Header</span>
  </button>
</div>
