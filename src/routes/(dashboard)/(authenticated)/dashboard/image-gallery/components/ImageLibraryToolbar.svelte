<script lang="ts">
  import Icon from "@iconify/svelte";

  import Searchbar from "../../../components/Searchbar.svelte";

  let {
    searchValue,
    onSearchInput,
    onUploadClick
  }: {
    searchValue: string;
    onSearchInput: (value: string) => void;
    onUploadClick: () => void;
  } = $props();
</script>

<div class="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
  <Searchbar value={searchValue} onInput={onSearchInput} placeholder="Cari nama atau alt text..." />

  <button
    type="button"
    onclick={onUploadClick}
    class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0d99ff] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008ae6]"
  >
    <Icon icon="lucide:upload" class="h-4 w-4" />
    <span>Upload Gambar</span>
  </button>
</div>
