<script lang="ts">
  import { RESIZE_WIDTH_PRESETS } from "#lib/utils/image-resize";

  let {
    shouldResize = $bindable(),
    maxWidth = $bindable()
  }: {
    shouldResize: boolean;
    maxWidth: number;
  } = $props();
</script>

<div class="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5">
  <label class="flex cursor-pointer items-center justify-between gap-3">
    <div>
      <span class="block text-xs font-semibold text-gray-800">
        Resize &amp; Kompres WebP di Lokal
      </span>
      <span class="block text-[11px] text-gray-500">
        {shouldResize
          ? "Gambar diperkecil & dikonversi ke WebP sebelum upload"
          : "Upload file asli tanpa resize"}
      </span>
    </div>
    <input
      type="checkbox"
      bind:checked={shouldResize}
      class="h-4 w-4 cursor-pointer accent-[#0d99ff]"
    />
  </label>

  {#if shouldResize}
    <div class="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-200 pt-3">
      <span class="mr-1 text-[11px] font-medium text-gray-500">Lebar Maks:</span>
      {#each RESIZE_WIDTH_PRESETS as preset (preset)}
        <button
          type="button"
          onclick={() => (maxWidth = preset)}
          class="cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors {maxWidth ===
          preset
            ? 'border-[#0d99ff] bg-blue-50 text-[#0d99ff]'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'}"
        >
          {preset}px
        </button>
      {/each}
    </div>
  {/if}
</div>
